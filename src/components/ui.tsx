import type { ReactNode } from "react";
import { useInView } from "../context";
import { cn } from "../utils/cn";

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "li" | "section" | "span";
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.12);
  const Tag = as as "div";
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "is-visible", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function Label({
  children,
  dark = false,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  className?: string;
}) {
  /* Light variant uses brass-700: brass-600 measured 4.44:1 on ivory-100,
     under the 4.5:1 AA minimum for this size. brass-700 = 7.14:1. */
  return (
    <span className={cn("label flex items-center gap-3", dark ? "text-brass-300" : "text-brass-700", className)}>
      <span className={cn("h-px w-8", dark ? "bg-brass-400/60" : "bg-brass-700/50")} />
      {children}
    </span>
  );
}

/**
 * Responsive image: WebP for capable clients, progressive JPEG as fallback,
 * with intrinsic dimensions so the browser reserves layout space (no CLS).
 */
export function Picture({
  webp,
  jpeg,
  alt,
  width,
  height,
  className,
  imgClassName,
  priority = false,
  sizes,
}: {
  webp: string;
  jpeg: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={webp} sizes={sizes} />
      <img
        src={jpeg}
        srcSet={sizes ? jpeg : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
        fetchPriority={priority ? "high" : "auto"}
        className={imgClassName}
      />
    </picture>
  );
}

/**
 * Accessible disclosure shared by the practice-area and FAQ accordions.
 *
 * The button exposes `aria-expanded`/`aria-controls`; the panel is a labelled
 * region that is `inert` while collapsed, so anything focusable inside it is
 * removed from the tab order even though the collapse is animated.
 */
export function Disclosure({
  id,
  open,
  onToggle,
  button,
  children,
  buttonClassName,
}: {
  id: string;
  open: boolean;
  onToggle: () => void;
  button: ReactNode;
  children: ReactNode;
  buttonClassName?: string;
}) {
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;
  return (
    <div className="border-b border-navy-900/12">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className={cn("flex w-full items-start gap-5 text-left rtl:text-right", buttonClassName)}
        >
          {button}
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={cn(
          "grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  titleEm,
  lead,
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  titleEm?: string;
  lead?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <Reveal>
          <Label dark={dark}>{eyebrow}</Label>
        </Reveal>
      )}
      <Reveal delay={60}>
        <h2
          className={cn(
            "mt-5 text-[1.85rem] leading-[1.15] tracking-[-0.01em] sm:text-[2.4rem] lg:text-[2.9rem]",
            dark ? "text-white" : "text-navy-900"
          )}
        >
          {title} {titleEm && <em className={cn("italic", dark ? "text-brass-300" : "text-brass-600")}>{titleEm}</em>}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={120}>
          <p
            className={cn(
              "mt-5 text-body-sm leading-relaxed sm:text-body",
              dark ? "text-navy-400/90" : "text-navy-600"
            )}
          >
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

type BtnProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline" | "outlineLight";
  type?: "button" | "submit";
  className?: string;
};

export function Btn({ children, href, onClick, variant = "primary", type = "button", className }: BtnProps) {
  const styles = {
    primary: "border border-navy-900 bg-navy-900 text-white hover:bg-navy-800 hover:border-navy-800",
    outline:
      "border border-navy-900/25 bg-transparent text-navy-900 hover:border-navy-900 hover:bg-navy-900 hover:text-white",
    outlineLight: "border border-white/30 bg-transparent text-white hover:border-brass-300 hover:text-brass-300",
  }[variant];

  const cls = cn(
    "inline-flex items-center justify-center gap-2.5 px-6 py-3 text-label font-medium uppercase tracking-[0.16em] transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-500 focus-visible:ring-offset-2",
    styles,
    className
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={cls}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function DataTable({
  rows,
  dark = false,
  className,
}: {
  rows: { k: string; v: string }[];
  dark?: boolean;
  className?: string;
}) {
  return (
    <dl className={cn("divide-y", dark ? "divide-white/10" : "divide-navy-900/10", className)}>
      {rows.map((r) => (
        <div key={r.k} className="grid gap-1 py-3.5 sm:grid-cols-[9rem_1fr] sm:gap-4">
          <dt className={cn("label pt-0.5", dark ? "text-brass-300/80" : "text-navy-500")}>{r.k}</dt>
          <dd className={cn("text-body-sm", dark ? "text-white/85" : "text-navy-800")}>{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}
