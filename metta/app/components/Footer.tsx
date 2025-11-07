import ThemeToggle from '../components/ThemeToggle'

export default function Footer() {
  return (
    <footer className="p-4 mt-8" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <p style={{ color: 'var(--foreground)' }}>© 2025 MettaThought</p>
        <ThemeToggle />
      </div>
    </footer>
  );
}