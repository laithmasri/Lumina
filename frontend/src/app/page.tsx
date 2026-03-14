import Image from "next/image";

type HealthResponse = {
  status: string;
  service: string;
};


/**
 * Build the absolute URL for a backend API endpoint.
 * 
 * This function reads the base URL from the NEXT_PUBLIC_API_URL environment 
 * variable and appends the provided path to it.
 * 
 * @param path - The path to the API endpoint.
 * @returns The full URL to the API endpoint.
 */
function buildApiUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

  return `${baseUrl}${path}`;
}


/**
 * Fetch the health status from the backend API.
 * 
 * @returns The health status from the backend API, or null if the request fails.
 */
async function fetchHealth(): Promise<HealthResponse | null> {
  const url = buildApiUrl("/health");

  try {
    const response = await fetch(url, {
      method: "GET",
      next: { revalidate: 5 },
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as HealthResponse;

    return data;
  }
  catch {
    return null;
  }
}


/**
 * Home page for the Lumina frontend.
 *
 * This is a server component in the Next.js App Router. It fetches
 * the backend health status during the initial render and displays
 * a simple indicator to confirm that the API is reachable.
 */
export default async function Home(): Promise<React.JSX.Element> {
  const health = await fetchHealth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />

        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Lumina – short stories with AI-generated media
          </h1>

          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Backend health:{" "}
            <span className="font-semibold">
              {health ? `${health.status} (${health.service})` : "unreachable"}
            </span>
          </p>
        </div>
      </main>
    </div>
  );
}