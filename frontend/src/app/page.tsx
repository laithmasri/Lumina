import FeaturedStory from "@/components/FeaturedStory";
import StoryFeed from "@/components/StoryFeed";
import StoryForm from "@/components/StoryForm";

import { fetchStories } from "@/app/lib/api";

export default async function Home() {
  const stories = await fetchStories();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-8 md:px-8">
      <section>
        <FeaturedStory />
      </section>

      <section className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Trending Stories
          </h2>

          <p className="mt-2 text-zinc-400">
            Discover immersive AI-generated stories from creators worldwide.
          </p>
        </div>
      </section>

      <StoryFeed stories={stories} />

      <section className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Create Your Story</h2>

          <p className="mt-2 text-zinc-400">
            Share cinematic stories with the Lumina community.
          </p>
        </div>

        <StoryForm />
      </section>
    </div>
  );
}