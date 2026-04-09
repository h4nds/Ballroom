import { useEffect, useId } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function HintsModal({ open, onClose }: Props) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-root" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal sheet-pop" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <h2 id={titleId} className="modal-title">
          keyboard
        </h2>
        <ul className="hints-list">
          <li>
            <kbd>?</kbd> open this sheet
          </li>
          <li>
            <kbd>Esc</kbd> close any open sheet
          </li>
          <li>when signed in, use the header <strong>profile</strong> button to change how you appear</li>
          <li>sounds unlock after your first click — toggle them in the header when signed in</li>
        </ul>
        <div className="modal-actions">
          <button type="button" className="btn-primary" onClick={onClose}>
            got it
          </button>
        </div>
      </div>
    </div>
  );
}
