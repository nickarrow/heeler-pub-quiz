/**
 * The unofficial-and-unaffiliated notice. `design.md` §7 puts this in the
 * footer on every screen, and it is a deliverable of increment 1 because that
 * is the increment which publishes to the internet.
 *
 * It names the show deliberately. A disclaimer that does not say what it is
 * disclaiming affiliation with does not disclaim anything, and naming the
 * rights holders is what makes the sentence do work. §7's bans are on the
 * product name, the repository name, the domain, character art, title-card
 * lettering, theme music and screenshots — none of which this touches.
 */
export function FooterNotice() {
  return (
    <footer className="border-t-2 border-ink/15 px-6 py-4 text-fluid-sm text-ink/70">
      <p>
        Heeler Pub Quiz is an unofficial, fan-made quiz. It is not affiliated with, endorsed by, or
        connected to Bluey, Ludo Studio, BBC Studios, or any of their licensees.
      </p>
    </footer>
  )
}
