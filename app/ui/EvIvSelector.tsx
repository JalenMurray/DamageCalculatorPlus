export default function EvIvSelector({
  onSelect,
  selected,
}: {
  onSelect: (evs: number[], ivs: number[]) => void;
  selected: { evs: number[]; ivs: number[] };
}) {
  function setIvsFull() {
    onSelect(selected.evs, [31, 31, 31, 31, 31, 31]);
  }

  function setIvsAverage() {
    onSelect(selected.evs, [15, 15, 15, 15, 15, 15]);
  }

  function setIvsEmpty() {
    onSelect(selected.evs, [0, 0, 0, 0, 0, 0]);
  }

  function handleIvChange(index: number, e: any) {
    const newIV: number = parseInt(e.target.value);
    if (newIV > 31 || newIV < 0) {
      return;
    }
    onSelect(
      selected.evs,
      selected.ivs.map((iv, i) => (i === index ? newIV : iv))
    );
  }

  function setEvsAtt() {
    onSelect([0, 252, 0, 0, 0, 252], selected.ivs);
  }

  function setEvsSpAtt() {
    onSelect([0, 0, 0, 252, 0, 252], selected.ivs);
  }

  function handleEvChange(index: number, e: any) {
    const newEV: number = parseInt(e.target.value);
    if (newEV > 252 || newEV < 0) {
      return;
    }
    onSelect(
      selected.evs.map((iv, i) => (i === index ? newEV : iv)),
      selected.ivs
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      <div className="flex flex-col gap-4">
        <h1>Enter Ivs</h1>
        <div className="card bg-primary text-primary-content h-[300px] p-4">
          <p>Presets:</p>
          <div className="grid grid-cols-3 gap-4 p-2">
            <button className="btn btn-accent" onClick={setIvsFull}>
              Full
            </button>
            <button className="btn btn-accent" onClick={setIvsAverage}>
              Average
            </button>
            <button className="btn btn-accent" onClick={setIvsEmpty}>
              Empty
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-2">
            {['HP', 'Att', 'Def', 'Sp. Att', 'Sp. Def', 'Speed'].map((stat, i) => (
              <label
                className="input border-primary-content flex bg-primary text-primary-content justify-center items-center"
                key={i}
              >
                <p className="flex-1">{stat}</p>
                <input
                  className="flex-none w-10"
                  type="number"
                  max={31}
                  min={0}
                  value={selected ? selected.ivs[i] : 0}
                  onChange={(e) => handleIvChange(i, e)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <h1>Enter Evs</h1>
        <div className="card bg-accent text-accent-content h-[300px] p-4">
          <p>Presets:</p>
          <div className="grid grid-cols-2 gap-4 p-2">
            <button className="btn btn-primary" onClick={setEvsAtt}>
              Att + Speed
            </button>
            <button className="btn btn-primary" onClick={setEvsSpAtt}>
              Sp. Att + Speed
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4 p-2">
            {['HP', 'Att', 'Def', 'Sp. Att', 'Sp. Def', 'Speed'].map((stat, i) => (
              <label
                className="input border-accent-content flex bg-accent text-accent-content justify-center items-center"
                key={i}
              >
                <p className="flex-1">{stat}</p>
                <input
                  className="flex-none w-12"
                  type="number"
                  max={31}
                  min={0}
                  value={selected ? selected.evs[i] : 0}
                  onChange={(e) => handleEvChange(i, e)}
                />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
