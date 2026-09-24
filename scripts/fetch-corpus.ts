// Fetch the corpus into .corpus/, which is gitignored. The script is committed;
// its output never is. See content-pipeline.md "Three tiers of content".
//
// This increment (increments.md §2) reads, counts and reports. It authors no
// questions. The corpus it writes is a working artefact: the reality-check answers
// are computed from it, and it can be regenerated at any time by rerunning this.
//
// DETERMINISM is a requirement, not a nicety. increments.md §2 verifies this
// increment by rerunning the script from clean and confirming the same corpus. A
// live wiki edits under us and MediaWiki stamps every response with volatile
// fields (revision ids, timestamps, "touched"). So we keep only stable content —
// the wikitext and the title — sort every collection by title, and write with a
// trailing newline and sorted JSON keys. Two runs minutes apart diff clean unless
// an editor actually changed an article's text, which is the only difference that
// should ever show.
//
// Sources are pinned in corpus-sources.ts. Nothing here is search-driven.

import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { WIKIPEDIA_API, WIKI_API, apiGet, apiGetAll } from './corpus-sources.ts'

const corpusRoot = resolve(import.meta.dirname, '..', '.corpus')

type PageRecord = {
  title: string
  sourceUrl: string
  /** UTF-8 byte length of the wikitext. The count metric for the reality check. */
  bytes: number
}

type Manifest = {
  fetchedUtc: string
  wikipedia: { title: string; sourceUrl: string; bytes: number }
  wiki: {
    episodeArticles: PageRecord[]
    scriptPages: PageRecord[]
  }
}

function byteLength(text: string): number {
  return Buffer.byteLength(text, 'utf8')
}

/** Deterministic JSON: sorted keys, trailing newline. */
function writeJson(path: string, value: unknown): void {
  writeFileSync(path, `${JSON.stringify(value, sortedReplacer(value), 2)}\n`, 'utf8')
}

/** A replacer that emits object keys in sorted order at every level. */
function sortedReplacer(_root: unknown): (key: string, value: unknown) => unknown {
  return (_key, value) => {
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const record = value as Record<string, unknown>
      const sorted: Record<string, unknown> = {}
      for (const key of Object.keys(record).sort()) sorted[key] = record[key]
      return sorted
    }
    return value
  }
}

/** A wiki page's raw wikitext, or undefined if the page is missing. */
function extractRevisionContent(response: unknown): string | undefined {
  const pages = (response as { query?: { pages?: unknown[] } }).query?.pages
  if (!Array.isArray(pages) || pages.length === 0) return undefined
  const page = pages[0] as { missing?: boolean; revisions?: { slots?: { main?: { content?: string } } }[] }
  if (page.missing) return undefined
  return page.revisions?.[0]?.slots?.main?.content
}

function fileNameForTitle(title: string): string {
  // A stable, filesystem-safe name. Reversible enough for a working artefact; the
  // manifest holds the true title and URL.
  return `${title.replace(/[\\/:*?"<>|]/g, '_')}.wikitext`
}

async function fetchWikipediaEpisodeList(): Promise<Manifest['wikipedia']> {
  const title = 'List of Bluey episodes'
  const response = await apiGet(WIKIPEDIA_API, {
    action: 'query',
    prop: 'revisions',
    rvprop: 'content',
    rvslots: 'main',
    titles: title,
    formatversion: '2',
  })
  const content = extractRevisionContent(response)
  if (content === undefined) throw new Error(`Wikipedia page "${title}" returned no content`)
  writeFileSync(resolve(corpusRoot, 'wikipedia', fileNameForTitle(title)), `${content}\n`, 'utf8')
  return {
    title,
    sourceUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, '_'))}`,
    bytes: byteLength(content),
  }
}

/** Titles of the wiki's episode articles, from Category:Episodes, sorted. */
async function fetchEpisodeArticleTitles(): Promise<string[]> {
  const members = await apiGetAll<{ title: string }>(
    WIKI_API,
    {
      action: 'query',
      list: 'categorymembers',
      cmtitle: 'Category:Episodes',
      cmtype: 'page',
      cmlimit: '500',
    },
    (r) => (r as { query?: { categorymembers?: { title: string }[] } }).query?.categorymembers ?? [],
    'cmcontinue',
    'cmcontinue',
  )
  return members.map((m) => m.title).sort()
}

/** Titles of every non-redirect main-namespace page ending in "/Script", sorted. */
async function fetchScriptPageTitles(): Promise<string[]> {
  const pages = await apiGetAll<{ title: string }>(
    WIKI_API,
    {
      action: 'query',
      list: 'allpages',
      apnamespace: '0',
      apfilterredir: 'nonredirects',
      aplimit: '500',
    },
    (r) => (r as { query?: { allpages?: { title: string }[] } }).query?.allpages ?? [],
    'apcontinue',
    'apcontinue',
  )
  return pages
    .map((p) => p.title)
    .filter((t) => t.endsWith('/Script'))
    .sort()
}

/** Fetch each title's wikitext, write it, and return manifest records, sorted. */
async function fetchWikiPages(titles: string[], subdir: string): Promise<PageRecord[]> {
  const records: PageRecord[] = []
  // Batches of 50 titles per request, MediaWiki's default cap for anonymous callers.
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50)
    const response = await apiGet(WIKI_API, {
      action: 'query',
      prop: 'revisions',
      rvprop: 'content',
      rvslots: 'main',
      titles: batch.join('|'),
    })
    const pages = (response as { query?: { pages?: Record<string, unknown> } }).query?.pages ?? {}
    for (const raw of Object.values(pages)) {
      const page = raw as {
        title: string
        missing?: string
        revisions?: { slots?: { main?: { '*'?: string } } }[]
      }
      if (page.missing !== undefined) continue
      const content = page.revisions?.[0]?.slots?.main?.['*']
      if (content === undefined) continue
      writeFileSync(resolve(corpusRoot, subdir, fileNameForTitle(page.title)), `${content}\n`, 'utf8')
      records.push({
        title: page.title,
        sourceUrl: `https://blueypedia.fandom.com/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}`,
        bytes: byteLength(content),
      })
    }
  }
  return records.sort((a, b) => (a.title < b.title ? -1 : a.title > b.title ? 1 : 0))
}

async function main(): Promise<void> {
  // Start from clean so a rerun cannot leave a stale file behind. This is what
  // makes "reruns from clean" true rather than asserted.
  rmSync(corpusRoot, { recursive: true, force: true })
  for (const dir of ['wikipedia', 'wiki/episodes', 'wiki/scripts']) {
    mkdirSync(resolve(corpusRoot, dir), { recursive: true })
  }

  console.log('Fetching Wikipedia episode list...')
  const wikipedia = await fetchWikipediaEpisodeList()

  console.log('Enumerating wiki episode articles...')
  const episodeTitles = await fetchEpisodeArticleTitles()
  console.log(`  ${episodeTitles.length} episode articles`)
  const episodeArticles = await fetchWikiPages(episodeTitles, 'wiki/episodes')

  console.log('Enumerating wiki /Script pages...')
  const scriptTitles = await fetchScriptPageTitles()
  console.log(`  ${scriptTitles.length} /Script pages`)
  const scriptPages = await fetchWikiPages(scriptTitles, 'wiki/scripts')

  const manifest: Manifest = {
    // A single coarse date, not a per-request timestamp, so the manifest itself is
    // stable across reruns on the same day. It records when, without adding noise
    // that would make every rerun diff dirty.
    fetchedUtc: new Date().toISOString().slice(0, 10),
    wikipedia,
    wiki: { episodeArticles, scriptPages },
  }
  writeJson(resolve(corpusRoot, 'manifest.json'), manifest)

  console.log(
    `\nDone. Wikipedia list + ${episodeArticles.length} episode articles + ` +
      `${scriptPages.length} script pages written to .corpus/.`,
  )
}

await main()
