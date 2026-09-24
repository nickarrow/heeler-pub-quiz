import { describe, expect, it } from 'vitest'
import { ALLOWED_HOSTS, assertAllowed } from './corpus-sources.ts'

// The host-pinning guard. corpus-sources.ts calls this the point of the file:
// content-pipeline.md §1 requires the fetch to reach only Wikipedia and the
// established wiki, because at least three fanon wikis host fan-invented material
// and a question sourced from invented canon is "the worst possible failure for
// this audience." assertAllowed is the only thing standing between the fetch and a
// fanon host, so it is exactly the kind of load-bearing, pure function that should
// not be able to regress unnoticed — a refactor that dropped the check, or widened
// the allow-list, would otherwise ship silently.
describe('assertAllowed', () => {
  it('permits the two pinned hosts', () => {
    expect(() => assertAllowed('https://en.wikipedia.org/w/api.php?action=query')).not.toThrow()
    expect(() => assertAllowed('https://blueypedia.fandom.com/api.php?action=query')).not.toThrow()
  })

  it('rejects a fanon wiki', () => {
    // A real fanon host pattern: a different Fandom subdomain carrying invented canon.
    expect(() => assertAllowed('https://bluey-fanon.fandom.com/api.php')).toThrow(/Refusing to fetch/)
  })

  it('rejects a look-alike host that merely contains an allowed one', () => {
    // host is compared exactly, so a subdomain or suffix attack does not pass.
    expect(() => assertAllowed('https://en.wikipedia.org.evil.example/api.php')).toThrow()
    expect(() => assertAllowed('https://blueypedia.fandom.com.evil.example/api.php')).toThrow()
    expect(() => assertAllowed('https://notblueypedia.fandom.com/api.php')).toThrow()
  })

  it('pins exactly two hosts, so widening the allow-list is a visible change', () => {
    // If someone adds a host, this fails and forces the addition to be deliberate.
    expect([...ALLOWED_HOSTS]).toEqual(['en.wikipedia.org', 'blueypedia.fandom.com'])
  })
})
