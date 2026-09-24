// The pinned sources for the corpus fetch, and the low-level request helpers.
//
// PINNING IS THE POINT OF THIS FILE. content-pipeline.md §1 requires the fetch to
// reach only two hosts: Wikipedia and the established Bluey wiki. At least three
// FANON wikis host fan-invented material, including a fabricated fourth-series
// episode list, and a question sourced from invented canon is the worst possible
// failure for this audience. So there is no search-driven discovery anywhere in
// this pipeline: every request is built from a hardcoded host and asserted against
// the allow-list below before it leaves the machine. A typo or a redirect to a
// disallowed host throws rather than silently fetching.
//
// The established wiki is blueypedia.fandom.com. bluey.fandom.com redirects to it;
// we name the canonical host directly so nothing depends on following a redirect.
//
// Node's native TypeScript execution runs this file with no build step, so it
// avoids enums, namespaces with runtime code, parameter properties, decorators and
// tsconfig path aliases, exactly as the other scripts do.

/** The only hosts this pipeline is ever allowed to contact. */
export const ALLOWED_HOSTS = ['en.wikipedia.org', 'blueypedia.fandom.com'] as const

export const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php'
export const WIKI_API = 'https://blueypedia.fandom.com/api.php'

// A descriptive User-Agent is the courtesy both wikis' request policies ask for.
const USER_AGENT = 'HeelerPubQuiz-corpus-fetch/1.0 (non-commercial fan quiz; research use)'

/** Throws if a URL points anywhere other than the allow-list. Defense in depth. */
export function assertAllowed(url: string): void {
  const host = new URL(url).host
  if (!(ALLOWED_HOSTS as readonly string[]).includes(host)) {
    throw new Error(
      `Refusing to fetch from "${host}". Only ${ALLOWED_HOSTS.join(' and ')} are allowed. ` +
        'A fanon wiki or an unexpected redirect would land here.',
    )
  }
}

type QueryParams = Record<string, string>

/**
 * A MediaWiki Action API GET returning parsed JSON. `redirect: 'error'` means a
 * redirect to another host cannot smuggle us off the allow-list without throwing;
 * the host is also asserted before the request and would have to be re-asserted on
 * any follow.
 */
export async function apiGet(apiBase: string, params: QueryParams): Promise<unknown> {
  const url = new URL(apiBase)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  url.searchParams.set('format', 'json')
  assertAllowed(url.href)
  const response = await fetch(url.href, {
    headers: { 'User-Agent': USER_AGENT, 'Accept-Encoding': 'gzip' },
    redirect: 'error',
  })
  if (!response.ok) {
    throw new Error(`${apiBase} returned HTTP ${response.status} for ${JSON.stringify(params)}`)
  }
  return response.json()
}

/**
 * Walk a MediaWiki `continue` cursor to completion, concatenating one array out of
 * each page of results. `extract` pulls the array from each response; `continueKey`
 * is the field the API echoes back to request the next page.
 */
export async function apiGetAll<T>(
  apiBase: string,
  params: QueryParams,
  extract: (response: unknown) => T[],
  continueParam: string,
  continueField: string,
): Promise<T[]> {
  let out: T[] = []
  let cursor: string | undefined
  // A generous guard against a pathological loop; real categories here need far
  // fewer round trips than this.
  for (let page = 0; page < 100; page += 1) {
    const merged: QueryParams = { ...params }
    if (cursor !== undefined) merged[continueParam] = cursor
    const response = (await apiGet(apiBase, merged)) as {
      continue?: Record<string, string>
    }
    out = out.concat(extract(response))
    const next = response.continue?.[continueField]
    if (next === undefined) return out
    cursor = next
  }
  throw new Error(`continue cursor did not terminate for ${JSON.stringify(params)}`)
}
