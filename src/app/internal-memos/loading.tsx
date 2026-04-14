export default function InternalMemosLoading() {
  return (
    <main className="w-full min-h-screen text-black flex flex-col p-8 lg:p-24 bg-black">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-12 bg-white/90 p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Header skeleton */}
        <div className="border-b-4 border-black pb-8">
          <div className="h-4 w-56 bg-black/10 mb-3" />
          <div className="h-12 w-80 bg-black/20 mb-4" />
          <div className="h-4 w-full max-w-md bg-black/10" />
        </div>

        {/* Memo cards skeleton */}
        {[1, 2].map((i) => (
          <div key={i} className="border-2 border-black/20 p-6 animate-pulse">
            <div className="flex gap-2 mb-3">
              <div className="h-5 w-16 bg-black/10" />
              <div className="h-5 w-20 bg-black/10" />
            </div>
            <div className="h-7 w-64 bg-black/15 mb-3" />
            <div className="h-4 w-full max-w-md bg-black/10" />
          </div>
        ))}
      </div>
    </main>
  );
}
