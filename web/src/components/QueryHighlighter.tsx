import { useEffect } from 'react'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

type QueryHighlighterProps = {
  query: string
  width?: string
}

export default function QueryHighlighter({
  query,
  width,
}: QueryHighlighterProps) {
  useEffect(() => {
    hljs.highlightAll()
  }, [query])

  return (
    <pre className={width}>
      <code className="language-sql">{query.trim()}</code>
    </pre>
  )
}
