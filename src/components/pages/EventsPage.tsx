import { events } from "../../data/floorContent";

export function EventsPage() {
  return (
    <section className="page events-page" aria-labelledby="events-title">
      <header className="page-head">
        <p className="page-kicker">this week</p>
        <h1 id="events-title" className="page-title">
          events
        </h1>
        <p className="page-lead">What is happening on the floor. Show up, or read the notes after.</p>
      </header>
      <ol className="event-list">
        {events.map((event) => (
          <li key={event.id}>
            <article className="event-card">
              <p className="event-when">{event.when}</p>
              <h2>{event.title}</h2>
              <p className="thread-meta">{event.where}</p>
              <p>{event.detail}</p>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
