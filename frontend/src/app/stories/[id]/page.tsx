import Link from "next/link";

import StoryActions from "@/components/StoryActions";

import { fetchStory } from "@/app/lib/api";
import { notFound } from "next/navigation";

type StoryPageProps = {
  params: Promise<{ id: string }>;
};

export default async function StoryPage({
  params,
}: StoryPageProps): Promise<React.JSX.Element> {
  const { id } = await params;

  const storyId = Number(id);

  if (Number.isNaN(storyId)) {
    notFound();
  }

  const story = await fetchStory(storyId);

  if (!story) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <section className="relative h-[60vh] overflow-hidden">
        <img
          src={story.cover_image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"}
          alt={story.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <Link
            href="/"
            className="mb-6 inline-block text-sm text-zinc-300 transition hover:text-white"
          >
            ← Back to stories
          </Link>

          <div className="mb-4 flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="creator"
              className="h-12 w-12 rounded-full border border-white/20"
            />

            <div>
              <p className="font-medium">@lumina_creator</p>
              <p className="text-sm text-zinc-400">
                {new Date(story.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <h1 className="max-w-4xl text-5xl font-bold tracking-tight md:text-7xl">
            {story.title}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <p className="whitespace-pre-wrap text-lg leading-9 text-zinc-300">
            {story.body}
          </p>

          <StoryActions story={story} />
        </div>
      </section>
    </div>
  );
}