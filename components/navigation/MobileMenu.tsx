"use client";

import { AnimatePresence, motion } from "motion/react";

import { EASE } from "@/lib/constants";
import { NavAnchor } from "./NavAnchor";
import { useScrollLock } from "@/lib/hooks";
import { navigation } from "@/data/navigation";
import { contact } from "@/data/site";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileMenu({ open, onClose }: MobileMenuProps) {
  useScrollLock(open);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu"
          id="mobile-menu"
          className="fixed inset-0 z-[95] flex flex-col bg-void lg:hidden"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: EASE.inOutQuint }}
        >
          <div className="grid-field pointer-events-none absolute inset-0 opacity-40" aria-hidden />

          <nav
            aria-label="Primary"
            className="page relative flex flex-1 flex-col justify-center gap-1 pt-[var(--nav-h)]"
          >
            {/* The entrance animates a wrapper rather than the link itself:
                half these entries are routes now and render through <Link>,
                which motion cannot animate directly. The anchor still fills
                the row, so nothing about the target area changes. */}
            {navigation.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 26 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12, transition: { duration: 0.2 } }}
                transition={{ duration: 0.7, delay: 0.14 + index * 0.055, ease: EASE.outExpo }}
              >
                <NavAnchor
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-baseline gap-4 border-b border-line/60 py-4"
                >
                  <span className="label !text-faint">{item.index}</span>
                  <span className="display text-[length:var(--text-display-sm)] text-bone transition-colors group-hover:text-signal-bright">
                    {item.label}
                  </span>
                </NavAnchor>
              </motion.div>
            ))}
          </nav>

          <motion.div
            className="page relative flex flex-col gap-3 pb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <a href={contact.phoneHref} className="text-lg text-bone">
              {contact.phone}
            </a>
            <a href={contact.emailHref} className="text-sm text-mute">
              {contact.email}
            </a>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
