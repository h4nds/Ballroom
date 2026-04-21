/** Top row digit keys with Shift — stable across common keyboard layouts. */
const SHIFT_DIGIT_TO_TAB = {
  Digit1: "boards",
  Digit2: "latest",
  Digit3: "showcase",
  Digit4: "collabs",
  Digit5: "events",
} as const;

export type SectionTabId = (typeof SHIFT_DIGIT_TO_TAB)[keyof typeof SHIFT_DIGIT_TO_TAB];

export function tabFromShiftDigitCode(code: string): SectionTabId | null {
  const k = code as keyof typeof SHIFT_DIGIT_TO_TAB;
  return SHIFT_DIGIT_TO_TAB[k] ?? null;
}

/** True when the user is likely editing text — skip global letter/digit shortcuts. */
export function isTypingInTextField(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  if (el.isContentEditable) return true;
  const tag = el.tagName;
  if (tag === "SELECT") return true;
  if (tag === "TEXTAREA") return true;
  if (tag === "INPUT") {
    const type = (el as HTMLInputElement).type?.toLowerCase() ?? "text";
    if (
      type === "checkbox" ||
      type === "radio" ||
      type === "button" ||
      type === "submit" ||
      type === "reset" ||
      type === "file"
    ) {
      return false;
    }
    return true;
  }
  return false;
}
