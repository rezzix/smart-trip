export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-5xl font-bold tracking-tight">Smart Trip</h1>
      <p className="text-lg text-gray-400">Online multiplayer educational game</p>
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium transition hover:bg-blue-500"
        >
          Create Game
        </button>
        <button
          type="button"
          className="rounded-lg border border-gray-600 px-6 py-3 font-medium transition hover:bg-gray-800"
        >
          Join Game
        </button>
      </div>
    </main>
  );
}
