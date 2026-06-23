import { cn } from "@/lib/utils";
import { parseFocusLine, parseTechText } from "@/lib/tech-text";

export function TechText({
  children,
  className,
  as: Tag = "span",
}: {
  children: string;
  className?: string;
  as?: "span" | "p";
}) {
  return <Tag className={className}>{parseTechText(children)}</Tag>;
}

export function FocusTechLine({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return <span className={className}>{parseFocusLine(children)}</span>;
}

export function TechBadge({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span className={cn("font-semibold", className)}>
      {children}
    </span>
  );
}
