export default function ShippedLoading() {
  return (
    <main className="w-full min-h-screen text-black flex flex-col p-8 lg:p-24 bg-black md:pl-[19rem]">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-12 bg-white/90 p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* Ticker skeleton */}
        <div className="w-full border-2 border-black bg-black h-8 animate-pulse" />

        {/* Header skeleton */}
        <div className="border-b-4 border-black pb-8">
          <div className="h-4 w-48 bg-black/10 mb-3" />
          <div className="h-12 w-64 bg-black/20 mb-4" />
          <div className="h-4 w-full max-w-xl bg-black/10" />
        </div>

        {/* Project cards skeleton */}
        {[1, 2].map((i) => (
          <div key={i} className="border-2 border-black/20 p-6 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-20 bg-black/10" />
              <div className="h-8 w-48 bg-black/15" />
            </div>
            <div className="h-4 w-full max-w-lg bg-black/10 mb-2" />
            <div className="h-4 w-3/4 bg-black/10" />
          </div>
        ))}
      </div>
    </main>
  );
}
