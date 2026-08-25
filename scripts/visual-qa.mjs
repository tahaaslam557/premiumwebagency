/**
 * Headless visual QA sweep.
 *
 * Drives Chrome over the DevTools Protocol: boots the page with software WebGL,
 * skips the preloader, walks every section (including a mid-sequence frame for
 * each pinned one), and writes screenshots plus a report of console errors and
 * horizontal-overflow offenders.
 *
 *   npm run qa:visual                      # 1600x1000 against localhost:3000
 *   npm run qa:visual -- 390 844 mobile    # width height label
 *   CHROME_PATH=... npm run qa:visual      # non-default Chrome install
 *
 * Output lands in .qa/<label>/.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const CHROME =
  process.env.CHROME_PATH ??
  (process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : "google-chrome");

const width = Number(process.argv[2] || 1600);
const height = Number(process.argv[3] || 1000);
const label = process.argv[4] || `${width}x${height}`;
const url = process.argv[5] || "http://localhost:3000/";
const outDir = path.join(root, ".qa", label);
const port = Number(process.env.CDP_PORT || 9222);

/** Third value: extra scroll in viewport heights, to land inside pinned sequences. */
const SECTIONS = [
  ["hero", "#hero"],
  ["manifesto", "#intelligence", 0.2],
  ["manifesto-mid", "#intelligence", 1.4],
  ["capabilities", "#capabilities"],
  ["engine", "#engine", 0.3],
  ["engine-mid", "#engine", 2.2],
  ["work", "#work", 0.4],
  ["work-mid", "#work", 2.5],
  ["proof", "#proof"],
  ["network", "#network"],
  ["method", "#method"],
  ["pricing", "#pricing"],
  ["conversion", "#start"],
  ["contact", "#contact"],
  ["footer", "footer", "bottom"],
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function waitForPort(target, timeout = 20_000) {
  const started = Date.now();
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect(target, "127.0.0.1");
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (Date.now() - started > timeout) reject(new Error("DevTools port never opened"));
        else setTimeout(attempt, 200);
      });
    };
    attempt();
  });
}

fs.mkdirSync(outDir, { recursive: true });

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${path.join(os_tmp(), `pwa-qa-${port}`)}`,
    // Software WebGL: headless has no GPU, and the 3D layer must still render.
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--hide-scrollbars",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-extensions",
    `--window-size=${width},${height}`,
    "about:blank",
  ],
  { stdio: "ignore" },
);

function os_tmp() {
  return process.env.TEMP || process.env.TMPDIR || "/tmp";
}

await waitForPort(port);

const targets = await fetch(`http://127.0.0.1:${port}/json/list`).then((r) => r.json());
const socket = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);

let messageId = 0;
const pending = new Map();
const consoleLog = [];

socket.addEventListener("message", (event) => {
  const message = JSON.parse(event.data);
  if (message.id && pending.has(message.id)) {
    pending.get(message.id)(message.result);
    pending.delete(message.id);
    return;
  }
  if (message.method === "Runtime.consoleAPICalled") {
    consoleLog.push({
      level: message.params.type,
      text: message.params.args.map((a) => a.value ?? a.description ?? "").join(" "),
    });
  }
  if (message.method === "Runtime.exceptionThrown") {
    const details = message.params.exceptionDetails;
    consoleLog.push({ level: "exception", text: details.exception?.description || details.text });
  }
  if (message.method === "Log.entryAdded") {
    consoleLog.push({ level: message.params.entry.level, text: message.params.entry.text });
  }
});

await new Promise((resolve) => socket.addEventListener("open", resolve));

const send = (method, params = {}) =>
  new Promise((resolve) => {
    const id = ++messageId;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

const evaluate = async (expression) => {
  const result = await send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  return result?.result?.value;
};

await send("Runtime.enable");
await send("Log.enable");
await send("Page.enable");
// Headless pages are unfocused, so `:focus` never matches. This makes focus
// states observable.
await send("Emulation.setFocusEmulationEnabled", { enabled: true });
await send("Emulation.setDeviceMetricsOverride", {
  width,
  height,
  deviceScaleFactor: 1,
  mobile: width < 768,
});

await send("Page.navigate", { url });
await sleep(6000);

// Skip the boot screen so shots show the settled page.
await evaluate(
  `document.querySelectorAll('button').forEach(b => { if (b.textContent.trim() === 'Skip') b.click(); }); true`,
);
await sleep(2500);

const report = { label, viewport: `${width}x${height}`, sections: [], console: [] };

report.webgl = await evaluate(`(() => {
  return JSON.stringify([...document.querySelectorAll('canvas')].map(c => {
    const r = c.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), ctx: !!(c.getContext('webgl2') || c.getContext('webgl')) };
  }));
})()`);

for (const [name, selector, offset = 0] of SECTIONS) {
  const found = await evaluate(`(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    if (!el) return false;
    const top = ${JSON.stringify(offset)} === 'bottom'
      ? document.documentElement.scrollHeight
      : el.getBoundingClientRect().top + window.scrollY + (${JSON.stringify(offset)} || 0) * window.innerHeight;
    window.scrollTo({ top, behavior: 'instant' });
    return true;
  })()`);

  if (!found) {
    report.sections.push({ name, missing: true });
    continue;
  }

  await sleep(1400);
  const { data } = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(path.join(outDir, `${name}.png`), Buffer.from(data, "base64"));
  report.sections.push({ name });
}

// Anything sticking out horizontally shows up here; the document itself must
// never scroll sideways.
report.overflow = await evaluate(`(() => {
  const doc = document.documentElement;
  const offenders = [];
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && (r.right > doc.clientWidth + 2 || r.left < -2)) {
      if (getComputedStyle(el).position === 'fixed') continue;
      offenders.push(el.tagName.toLowerCase() + '.' + String(el.className).slice(0, 60));
    }
  }
  return JSON.stringify({ scrollW: doc.scrollWidth, clientW: doc.clientWidth, offenders: offenders.slice(0, 10) });
})()`);

report.console = consoleLog.filter((m) => ["error", "exception", "warning"].includes(m.level));

fs.writeFileSync(path.join(outDir, "report.json"), JSON.stringify(report, null, 2));

const errors = report.console.filter((m) => m.level !== "warning");
const overflow = JSON.parse(report.overflow);

console.log(`\n${label} — ${report.sections.length} sections captured in ${path.relative(root, outDir)}`);
console.log(`  document width: ${overflow.scrollW} / ${overflow.clientW}${overflow.scrollW > overflow.clientW ? "  ← HORIZONTAL OVERFLOW" : "  ok"}`);
console.log(`  console errors: ${errors.length}`);
for (const error of errors.slice(0, 8)) console.log(`    ${error.text.slice(0, 160)}`);

socket.close();
chrome.kill();
process.exit(errors.length > 0 || overflow.scrollW > overflow.clientW ? 1 : 0);
