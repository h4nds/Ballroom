import { useEffect, useRef } from "react";
import { useForumSounds } from "../hooks/useForumSounds";
import { useUser } from "../context/UserContext";

type Props = {
  show: boolean;
  onDismiss: () => void;
};

export function WelcomeToast({ show, onDismiss }: Props) {
  const { user, visitInfo } = useUser();
  const { play } = useForumSounds();
  const playedRef = useRef(false);

  useEffect(() => {
    if (!show || !user) {
      playedRef.current = false;
      return;
    }
    if (!playedRef.current) {
      play("join");
      playedRef.current = true;
    }
    const t = window.setTimeout(onDismiss, 5200);
    return () => window.clearTimeout(t);
  }, [show, user, play, onDismiss]);

  if (!show || !user) return null;

  const streakLine =
    visitInfo && visitInfo.isNewDay && visitInfo.streak > 1 ? (
      <>
        day <strong>{visitInfo.streak}</strong> streak — keep the rhythm going.
      </>
    ) : (
      <>glad you&apos;re here. wander the boards, leave a thread when you&apos;re ready.</>
    );

  return (
    <div className="toast toast-pop" role="status">
      <div className="toast-glow" aria-hidden />
      <p className="toast-title">you&apos;re on the floor</p>
      <p className="toast-body">{streakLine}</p>
      <button type="button" className="toast-close" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
