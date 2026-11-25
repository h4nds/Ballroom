import { collabCalls } from "../../data/floorContent";

export function CollabsPage() {
  return (
    <section className="page collab-page" aria-labelledby="collab-title">
      <header className="page-head">
        <p className="page-kicker">the lobby</p>
        <h1 id="collab-title" className="page-title">
          collabs
        </h1>
        <p className="page-lead">Open calls. Say what you need, and who should answer.</p>
      </header>
      <ul className="collab-grid">
        {collabCalls.map((call) => (
          <li key={call.id}>
            <article className="collab-card">
              <p className="page-kicker">{call.need}</p>
              <h2>{call.title}</h2>
              <p>{call.detail}</p>
              <p className="thread-meta">
                {call.postedBy} · {call.when}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
