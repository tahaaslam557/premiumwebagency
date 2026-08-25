"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/Button";
import { EASE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  BUDGETS,
  PROJECT_TYPES,
  STEPS,
  TIMELINES,
  contactSchema,
  type ContactInput,
  type FieldErrors,
} from "@/lib/contact-schema";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactInput = {
  projectType: PROJECT_TYPES[0],
  goal: "",
  timeline: TIMELINES[0],
  budget: BUDGETS[0],
  name: "",
  email: "",
  phone: "",
  company: "",
  nda: false,
  website: "",
};

/**
 * Progressive contact flow. One question per screen, validated per step, with
 * every step reachable by keyboard. The whole payload is re-validated on the
 * server — this is convenience, not the security boundary.
 */
export function ContactFlow() {
  const [step, setStep] = useState(0);
  const [touchedType, setTouchedType] = useState(false);
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const liveRef = useRef<HTMLParagraphElement>(null);

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;
  const progress = (step + (status === "success" ? 1 : 0)) / STEPS.length;

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  };

  /** Validates only the fields this step owns, so early steps never block on later ones. */
  const validateStep = () => {
    const result = contactSchema.safeParse(values);
    if (result.success) return true;

    const stepErrors: FieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof ContactInput;
      if (current.fields.includes(field) && !(field in stepErrors)) {
        stepErrors[field] = issue.message;
      }
    }

    if (Object.keys(stepErrors).length) {
      setErrors(stepErrors);
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateStep()) return;
    if (isLast) {
      void submit();
      return;
    }
    setStep((value) => Math.min(STEPS.length - 1, value + 1));
  };

  const back = () => setStep((value) => Math.max(0, value - 1));

  const submit = async () => {
    const result = contactSchema.safeParse(values);
    if (!result.success) {
      const all: FieldErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ContactInput;
        if (!(field in all)) all[field] = issue.message;
      }
      setErrors(all);
      const firstBrokenStep = STEPS.findIndex((s) => s.fields.some((f) => all[f]));
      if (firstBrokenStep >= 0) setStep(firstBrokenStep);
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      const body = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: FieldErrors;
      };

      if (!response.ok || !body.ok) {
        setStatus("error");
        setServerMessage(body.message ?? "Something went wrong. Try again.");
        if (body.errors) setErrors(body.errors);
        return;
      }

      setStatus("success");
      setServerMessage(body.message ?? "Received.");
    } catch {
      setStatus("error");
      setServerMessage("Network error. Check your connection and try again.");
    }
  };

  const summary = useMemo(
    () => [
      { label: "Project", value: values.projectType },
      { label: "Timeline", value: values.timeline },
      { label: "Budget", value: values.budget },
    ],
    [values.projectType, values.timeline, values.budget],
  );

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE.outExpo }}
        className="rounded-2xl border border-signal/35 bg-gradient-to-b from-signal/[0.1] to-transparent p-9 lg:p-12"
        role="status"
      >
        <span className="label !text-signal-bright">Transmission complete</span>
        <p className="display mt-6 text-[length:var(--text-display-sm)] text-bone">
          Thanks, {values.name.split(" ")[0]}.
        </p>
        <p className="mt-4 max-w-md leading-relaxed text-bone-dim">{serverMessage}</p>

        <dl className="mt-9 grid gap-px border border-line bg-line sm:grid-cols-3">
          {summary.map((row) => (
            <div key={row.label} className="bg-void p-4">
              <dt className="label">{row.label}</dt>
              <dd className="mt-2 text-sm text-bone">{row.value}</dd>
            </div>
          ))}
        </dl>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        next();
      }}
      noValidate
      className="rounded-2xl border border-line bg-gradient-to-b from-tint/[0.04] to-transparent p-7 lg:p-10"
    >
      {/* Progress */}
      <div className="flex items-center gap-4">
        <span className="label !text-signal-bright tabular-nums">{current.index}</span>
        <div className="h-px flex-1 bg-line">
          <span
            className="block h-full bg-signal-bright transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ width: `${Math.max(progress, 0.05) * 100}%` }}
          />
        </div>
        <span className="label tabular-nums">
          {step + 1} / {STEPS.length}
        </span>
      </div>

      <div className="mt-9 min-h-[22rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.38, ease: EASE.outExpo }}
          >
            <h3 className="display text-[clamp(1.6rem,3vw,2.5rem)] text-bone">
              {current.question}
            </h3>
            <p className="mt-3 text-sm text-mute">{current.hint}</p>

            <div className="mt-8">
              {step === 0 ? (
                <OptionGrid
                  name="projectType"
                  options={PROJECT_TYPES}
                  value={values.projectType}
                  onChange={(value) => {
                    setTouchedType(true);
                    set("projectType", value);
                  }}
                  highlightSelected={touchedType}
                />
              ) : null}

              {step === 1 ? (
                <Field error={errors.goal} htmlFor="goal">
                  <textarea
                    id="goal"
                    name="goal"
                    rows={5}
                    value={values.goal}
                    onChange={(event) => set("goal", event.target.value)}
                    placeholder="e.g. Replace an ageing WooCommerce store and cut checkout drop-off."
                    aria-invalid={Boolean(errors.goal)}
                    aria-describedby={errors.goal ? "goal-error" : undefined}
                    className="w-full resize-none rounded-xl border border-line bg-void/60 p-4 text-bone outline-none transition-colors placeholder:text-faint focus:border-signal/60"
                  />
                  <p className="label mt-2 !text-faint">{values.goal.length} / 1200</p>
                </Field>
              ) : null}

              {step === 2 ? (
                <OptionGrid
                  name="timeline"
                  options={TIMELINES}
                  value={values.timeline}
                  onChange={(value) => set("timeline", value)}
                  highlightSelected
                />
              ) : null}

              {step === 3 ? (
                <OptionGrid
                  name="budget"
                  options={BUDGETS}
                  value={values.budget}
                  onChange={(value) => set("budget", value)}
                  highlightSelected
                />
              ) : null}

              {step === 4 ? (
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field error={errors.name} htmlFor="name" label="Name">
                    <Input
                      id="name"
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      invalid={Boolean(errors.name)}
                      onChange={(event) => set("name", event.target.value)}
                    />
                  </Field>

                  <Field error={errors.email} htmlFor="email" label="Email">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={values.email}
                      invalid={Boolean(errors.email)}
                      onChange={(event) => set("email", event.target.value)}
                    />
                  </Field>

                  <Field error={errors.phone} htmlFor="phone" label="Phone (optional)">
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      inputMode="tel"
                      value={values.phone ?? ""}
                      invalid={Boolean(errors.phone)}
                      onChange={(event) => set("phone", event.target.value)}
                    />
                  </Field>

                  <Field error={errors.company} htmlFor="company" label="Company (optional)">
                    <Input
                      id="company"
                      name="company"
                      autoComplete="organization"
                      value={values.company ?? ""}
                      invalid={Boolean(errors.company)}
                      onChange={(event) => set("company", event.target.value)}
                    />
                  </Field>

                  <label className="flex items-start gap-3 sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={Boolean(values.nda)}
                      onChange={(event) => set("nda", event.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-signal"
                    />
                    <span className="text-sm text-mute">
                      Send me a non-disclosure agreement for a confidential consultation.
                    </span>
                  </label>
                </div>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Honeypot — visually and programmatically hidden from real users. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Leave this field empty</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website ?? ""}
          onChange={(event) => set("website", event.target.value)}
        />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7">
        <button
          type="button"
          onClick={back}
          disabled={step === 0}
          className="label transition-colors enabled:hover:!text-bone disabled:opacity-30"
        >
          ← Back
        </button>

        <div className="flex items-center gap-4">
          {status === "error" ? (
            <p ref={liveRef} role="alert" className="text-sm text-danger">
              {serverMessage}
            </p>
          ) : null}
          <Button type="submit" size="lg" disabled={status === "submitting"}>
            {status === "submitting" ? "Sending…" : isLast ? "Send enquiry" : "Continue"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function OptionGrid<T extends string>({
  name,
  options,
  value,
  onChange,
  highlightSelected = true,
}: {
  name: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  highlightSelected?: boolean;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="flex flex-wrap gap-2.5">
      {options.map((option) => {
        const selected = highlightSelected && option === value;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option)}
            data-cursor="action"
            className={cn(
              "rounded-full border px-5 py-2.5 text-sm transition-colors duration-300",
              selected
                ? "border-signal-bright bg-signal/15 text-bone"
                : "border-line text-mute hover:border-bone/25 hover:text-bone",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  children,
  error,
  htmlFor,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  htmlFor: string;
  label?: string;
}) {
  return (
    <div>
      {label ? (
        <label htmlFor={htmlFor} className="label mb-2 block">
          {label}
        </label>
      ) : null}
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Input({
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      aria-invalid={invalid}
      aria-describedby={invalid ? `${props.id}-error` : undefined}
      className={cn(
        "h-12 w-full rounded-xl border bg-void/60 px-4 text-bone outline-none transition-colors placeholder:text-faint focus:border-signal/60",
        invalid ? "border-danger/60" : "border-line",
        className,
      )}
    />
  );
}
