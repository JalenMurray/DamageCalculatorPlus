import { CalculatorContext } from '@/app/context/calculator';
import { Stats } from '@/app/utils/definitions';
import { useContext } from 'react';

export default function StatsInput({
  stats,
  onChange,
}: {
  stats: number[];
  onChange: (newStat: number, i: number) => void;
}) {
  const { userPokemon, setUserPokemon } = useContext(CalculatorContext);

  function modifyStat(i: number, newStat: number) {
    if (!userPokemon.stats) {
      return;
    }
    switch (i) {
      case 0:
        setUserPokemon({ ...userPokemon, stats: { ...userPokemon.stats, hp: newStat } });
        break;
      case 1:
        setUserPokemon({ ...userPokemon, stats: { ...userPokemon.stats, attack: newStat } });
        break;
      case 2:
        setUserPokemon({ ...userPokemon, stats: { ...userPokemon.stats, defense: newStat } });
        break;
      case 3:
        setUserPokemon({ ...userPokemon, stats: { ...userPokemon.stats, specialAttack: newStat } });
        break;
      case 4:
        setUserPokemon({
          ...userPokemon,
          stats: { ...userPokemon.stats, specialDefense: newStat },
        });
        break;
      case 5:
        setUserPokemon({ ...userPokemon, stats: { ...userPokemon.stats, speed: newStat } });
        break;
    }
  }

  if (!userPokemon.stats) {
    return <div className="skeleton w-full h-[200px]" />;
  }

  const { hp, attack, defense, specialAttack, specialDefense, speed } = userPokemon.stats as Stats;

  return (
    <div className="flex flex-col gap-4">
      <h1>Enter the complete stat total for each stat.</h1>
      <div className="grid grid-cols-3 gap-4">
        {[
          ['HP', hp],
          ['Att', attack],
          ['Def', defense],
          ['Sp. Att', specialAttack],
          ['Sp. Def', specialDefense],
          ['Speed', speed],
        ].map((stat, i) => (
          <label className="input border-primary-content flex bg-primary text-primary-content justify-center items-center">
            <p className="flex-1">{stat[0]}</p>
            <input
              className="flex-none w-32"
              type="number"
              value={stat[1]}
              onChange={(e) => modifyStat(i, parseInt(e.target.value))}
            />
          </label>
        ))}
      </div>
    </div>
  );
}
