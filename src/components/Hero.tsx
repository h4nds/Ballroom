export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow" id="hero-title">
          welcome to the floor
        </p>
        <p className="hero-tagline">
          a place for creatives to post work, find collaborators, and just exist on the internet without it
          being weird about it.
        </p>
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
