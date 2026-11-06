/** 내용을 불러오는 동안 보여주는 회색 뼈대 */
export function PortfolioSkeleton() {
  const pulse = "animate-pulse bg-line/70 motion-reduce:animate-none";
  const block = `rounded-xl ${pulse}`;

  return (
    <div aria-busy="true" aria-label="내용을 불러오는 중" className="flex flex-1 flex-col">
      <div className="h-16 border-b border-line/80">
        <div className="mx-auto flex h-full max-w-5xl items-center px-4">
          <div className={`h-6 w-36 ${block}`} />
        </div>
      </div>
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-12 pb-14 md:pt-20">
        <div className={`size-28 rounded-full md:size-32 ${pulse}`} />
        <div className={`mt-6 h-8 w-full max-w-md ${block}`} />
        <div className={`mt-3 h-8 w-2/3 max-w-sm ${block}`} />
        <div className={`mt-6 h-10 w-24 rounded-full ${pulse}`} />
      </div>
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <div className={`mb-5 h-11 w-40 ${block}`} />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-44 rounded-2xl ${pulse}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
