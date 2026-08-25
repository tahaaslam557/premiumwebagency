import type { ReactNode } from "react";

import { MaskText } from "@/components/motion/MaskText";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
  titleId?: string;
};

/** Consistent section opener: index marker, system label, oversized title. */
export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
  titleId,
}: SectionHeaderProps) {
  return (
    <header className={cn("relative", align === "center" && "text-center", className)}>
      <Reveal className="flex items-center gap-4">
        <span
          className={cn(
            "label !text-signal-bright",
            align === "center" && "mx-auto flex items-center gap-4",
          )}
        >
          <span className="tabular-nums">{index}</span>
          <span className="inline-block h-px w-10 bg-signal/50 align-middle" />
          <span>{eyebrow}</span>
        </span>
      </Reveal>

      <MaskText
        as="h2"
        id={titleId}
        text={title}
        className="display mt-7 text-[length:var(--text-display-md)] text-bone"
      />

      {description ? (
        <Reveal
          delay={0.12}
          className={cn(
            "mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-mute",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </Reveal>
      ) : null}
    </header>
  );
}
