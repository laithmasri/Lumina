export default function MobileTabBar() {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-xl md:hidden">
        <div className="flex items-center justify-around py-4 text-sm text-zinc-400">
          <button>Home</button>
          <button>Explore</button>
          <button>Create</button>
          <button>Profile</button>
        </div>
      </div>
    );
  }
  