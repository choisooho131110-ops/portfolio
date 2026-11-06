export function Footer({ name }: { name: string }) {
  return (
    <footer className="border-t border-line">
      <p className="mx-auto max-w-5xl px-4 py-8 text-center text-sm text-ink/65">
        © 2026 {name || "나의 포트폴리오"}
      </p>
    </footer>
  );
}
