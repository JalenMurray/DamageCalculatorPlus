export function BattlePokemonSkeleton() {
  return (
    <div className="bg-slate-800 card w-[800px] h-[900px]">
      <div className="w-full h-[175px] grid grid-cols-2 overflow-hidden rounded-t-box">
        <div className="flex flex-col gap-4 justify-center pl-8">
          <div className="skeleton h-[40px] w-40" />
          <div className="flex gap-4">
            <div className="skeleton h-[25px] w-24" />
          </div>
        </div>
        <div className="w-full flex items-center justify-center">
          <div className="skeleton h-[150px] w-[150px] shrink-0 rounded-full"></div>
        </div>
      </div>
      <div className="skeleton card mx-8 h-[200px] p-4" />
      <div className="grid grid-cols-2 gap-12 p-4 mt-8">
        <div className="skeleton card w-auto h-[150px] m-2 p-4" />
        <div className="skeleton card w-auto h-[150px] m-2 p-4" />
        <div className="skeleton card w-auto h-[150px] m-2 p-4" />
        <div className="skeleton card w-auto h-[150px] m-2 p-4" />
      </div>
    </div>
  );
}
