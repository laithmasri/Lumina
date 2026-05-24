import Link from "next/link";

type Story = {
  id: number;
  title: string;
  body?: string;
  cover_image?: string;
};

type StoryCardProps = {
  story: Story;
};

export default function StoryCard({ story }: StoryCardProps) {
  return (
    <Link href={`/stories/${story.id}`}>
      <article className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]">
        <div className="overflow-hidden">
          <img
            src={
              story.cover_image ||
              "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
            }
            alt={story.title}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-5">
          <div className="mb-4 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="creator"
              className="h-10 w-10 rounded-full"
            />

            <div>
              <p className="font-medium">@lumina_creator</p>
              <p className="text-sm text-zinc-500">2h ago</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold tracking-tight transition group-hover:text-purple-300">
            {story.title}
          </h2>

          <p className="mt-3 line-clamp-3 text-zinc-400">
            {story.body}
          </p>

          <div className="mt-6 flex items-center gap-6 text-sm text-zinc-500">
            <span>♥ 2.1k</span>
            <span>💬 182</span>
            <span>👁 14k</span>
          </div>
        </div>
      </article>
    </Link>
  );
}