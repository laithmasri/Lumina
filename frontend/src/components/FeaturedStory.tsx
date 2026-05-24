export default function FeaturedStory() {
    return (
      <section className="relative overflow-hidden rounded-[32px] border border-white/10">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
          alt="featured"
          className="h-[600px] w-full object-cover"
        />
  
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
  
        <div className="absolute bottom-0 left-0 max-w-3xl p-8 md:p-16">
          <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm text-purple-300 backdrop-blur-md">
            Featured Story
          </span>
  
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
            Stories that feel alive.
          </h1>
  
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Explore immersive AI-generated stories with cinematic visuals,
            creator worlds, and unforgettable experiences.
          </p>
  
          <button className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-black transition hover:scale-105">
            Explore Stories
          </button>
        </div>
      </section>
    );
  }