import StoryCard from "./StoryCard";

type Story = {
  id: number;
  title: string;
  body?: string;
  cover_image?: string;
};

type StoryFeedProps = {
  stories: Story[];
};

export default function StoryFeed({ stories }: StoryFeedProps) {
  if (stories.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center backdrop-blur-xl">
        <h3 className="text-2xl font-bold">Your universe starts here</h3>

        <p className="mt-4 text-zinc-400">
          Create your first cinematic story and inspire the world.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
      {stories.map((story) => (
        <StoryCard key={story.id} story={story} />
      ))}
    </div>
  );
}