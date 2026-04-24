interface HomeProps {
  onStart: () => void;
}

export function Home({ onStart }: HomeProps) {
  return (
    <main className="page hero-page">
      <section className="shell hero-shell" aria-labelledby="home-title">
        <div className="eyebrow">Kill or Build</div>
        <h1 id="home-title">Should this AI project exist?</h1>
        <p className="hero-copy">
          Answer 12 questions. Get a blunt verdict. Decide whether to kill it, redesign it, or build it.
        </p>
        <p className="hero-subcopy">
          A ruthless seven-minute check for AI project ideas. For AI automations, copilots, and agents.
        </p>
        <div className="hero-actions">
          <button className="primary-button" onClick={onStart}>
            Start the assessment
          </button>
          <span className="friction-note">12 questions. No login. No saved history.</span>
        </div>
      </section>
    </main>
  );
}
