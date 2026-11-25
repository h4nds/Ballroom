export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">welcome to the floor</p>
        <h1 className="hero-title" id="hero-title">
          the floor
        </h1>
        <p className="hero-tagline">um hey..</p>
      </div>
      <dl className="hero-stats">
        <div>
          <dt>members</dt>
          <dd>
            <span className="stat-placeholder" title="Not connected to live data yet">
              —
            </span>
          </dd>
        </div>
        <div>
          <dt>posts today</dt>
          <dd>
            <span className="stat-placeholder" title="Not connected to live data yet">
              —
            </span>
          </dd>
        </div>
        <div>
          <dt>online now</dt>
          <dd>
            <span className="stat-placeholder" title="Not connected to live data yet">
              —
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
}
