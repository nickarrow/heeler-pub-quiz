// Triggering a file download from a string, extracted so the review screen stays
// declarative and this one piece of imperative DOM plumbing is testable on its
// own. The object URL is revoked in a `finally` so a throw between creating and
// clicking cannot leak it for the page's lifetime.

export function downloadTextFile(filename: string, contents: string, mimeType: string): void {
  const blob = new Blob([contents], { type: mimeType })
  const url = URL.createObjectURL(blob)
  try {
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
  } finally {
    URL.revokeObjectURL(url)
  }
}
