import type { Accent } from "../types";
import { initialsFrom, useUser } from "../context/UserContext";

const dotClass: Record<Accent, string> = {
  purple: "dot-purple",
  green: "dot-green",
  yellow: "dot-yellow",
};

export function Sidebar() {
  const { user } = useUser();

  const roster = user
    ? [
        {
          initials: initialsFrom(user.displayName || user.username),
          username: user.displayName || user.username,
          discipline: user.discipline,
          accent: user.accent,
        },
      ]
    : [];

  return (
    <aside className="sidebar" aria-label="Community">
      <section className="widget">
        <h3 className="widget-title">online now</h3>
        {roster.length === 0 ? (
          <p className="widget-empty">No one here yet. Sign in to show up on the floor.</p>
        ) : (
          <ul className="online-list">
            {roster.map((u) => (
              <li key={u.username} className="is-you">
                <span className={`status-dot ${dotClass[u.accent]}`} aria-hidden />
                <span className="online-avatar">{u.initials}</span>
                <span className="online-meta">
                  <span className="online-name">
                    {u.username} · you
                  </span>
                  <span className="online-disc">{u.discipline}</span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="widget">
        <h3 className="widget-title">newest threads</h3>
        <p className="widget-empty">Nothing posted yet. Threads will show up here.</p>
      </section>

      <section className="widget">
        <h3 className="widget-title">milestones</h3>
        <p className="widget-empty">Community milestones will land here.</p>
      </section>
    </aside>
  );
}
