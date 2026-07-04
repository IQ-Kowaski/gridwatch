export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-hairline)] bg-[var(--color-ink-2)]">
      <div className="mx-auto max-w-6xl px-5 py-8 text-xs text-[var(--color-paper-dim)] md:px-8">
        <p>
          Schedule and championship data via the{' '}
          <a
            className="underline decoration-[var(--color-hairline)] underline-offset-2 hover:text-[var(--color-signal)]"
            href="https://github.com/jolpica/jolpica-f1"
            target="_blank"
            rel="noreferrer"
          >
            Jolpica F1 API
          </a>
          . Grid Watch is an independent fan dashboard, not affiliated with Formula 1, the FIA,
          or any team. This site does not host or link to any broadcast or video stream.
        </p>
      </div>
    </footer>
  )
}
