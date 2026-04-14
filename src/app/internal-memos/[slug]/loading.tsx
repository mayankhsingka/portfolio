export default function MemoLoading() {
  return (
    <main className="w-full min-h-screen text-black flex flex-col items-center p-8 lg:p-24 bg-black">
      <div className="max-w-2xl mx-auto w-full z-10 flex flex-col gap-8 bg-white p-10 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="border-b-4 border-black pb-6">
          <div className="h-3 w-24 bg-black/10 mb-4" />
          <div className="h-8 w-3/4 bg-black/20 mb-3" />
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-black/10" />
            <div className="h-5 w-20 bg-black/10" />
          </div>
        </div>

        <div className="animate-pulse space-y-4">
          <div className="h-4 w-full bg-black/10" />
          <div className="h-4 w-5/6 bg-black/10" />
          <div className="h-4 w-full bg-black/10" />
          <div className="h-4 w-4/6 bg-black/10" />
          <div className="h-4 w-full bg-black/10" />
          <div className="h-4 w-3/4 bg-black/10" />
        </div>
      </div>
    </main>
  );
}
