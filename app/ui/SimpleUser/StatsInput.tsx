export default function StatsInput({
  stats,
  onChange,
}: {
  stats: number[];
  onChange: (newStat: number, i: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h1>
        Enter the complete stat total for each stat. Ex. Lvl 100 Garchomp with 31 Att IVs and 252
        EVs has an attack stat of 359.
      </h1>
      <div className="grid grid-cols-3 gap-4">
        {['HP', 'Att', 'Def', 'Sp. Att', 'Sp. Def', 'Speed'].map((stat, i) => (
          <label className="input border-primary-content flex bg-primary text-primary-content justify-center items-center">
            <p className="flex-1">{stat}</p>
            <input
              className="flex-none w-32"
              type="number"
              max={31}
              min={0}
              value={stats[i]}
              onChange={(e) => onChange(parseInt(e.target.value), i)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
