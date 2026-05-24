import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          Lumina
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#" className="text-zinc-400 transition hover:text-white">
            Explore
          </Link>

          <Link href="#" className="text-zinc-400 transition hover:text-white">
            Trending
          </Link>

          <Link href="#" className="text-zinc-400 transition hover:text-white">
            Following
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <input
            placeholder="Search stories..."
            className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm outline-none placeholder:text-zinc-500 md:block"
          />

          <img
            src="https://i.pravatar.cc/100"
            alt="profile"
            className="h-10 w-10 rounded-full border border-white/10"
          />
        </div>
      </div>
    </header>
  );
}