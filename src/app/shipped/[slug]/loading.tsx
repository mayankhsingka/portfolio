export default function CaseFileLoading() {
  return (
    <main className="w-full min-h-screen text-black flex flex-col p-8 lg:p-24 bg-black md:pl-[19rem]">
      <div className="max-w-4xl mx-auto w-full z-10 flex flex-col gap-12 bg-white p-10 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        {/* File tab skeleton */}
        <div className="flex justify-between items-start border-b-4 border-black pb-8">
          <div>
            <div className="h-4 w-32 bg-black/10 mb-4" />
            <div className="h-10 w-56 bg-black/20 mb-3" />
            <div className="h-4 w-40 bg-black/10" />
          </div>
          <div className="h-8 w-32 bg-black/10" />
        </div>

        {/* Problem section skeleton */}
        <div className="animate-pulse">
          <div className="h-6 w-48 bg-black/15 mb-4" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-black/10" />
            <div className="h-4 w-5/6 bg-black/10" />
            <div className="h-4 w-4/6 bg-black/10" />
          </div>
        </div>

        {/* Architecture section skeleton */}
        <div className="border-t-2 border-black/10 pt-8 animate-pulse">
          <div className="h-6 w-56 bg-black/15 mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 mb-3">
              <div className="h-4 w-6 bg-black/10 shrink-0" />
              <div className="h-4 w-full bg-black/10" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
