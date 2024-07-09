import { CalculatorContext } from '@/app/context/calculator';
import { useContext } from 'react';

export default function LevelInput() {
  const { userPokemon, setUserPokemon } = useContext(CalculatorContext);

  function setLevel(level: number) {
    if (level < 1 || level > 100) {
      return;
    }
    setUserPokemon({ ...userPokemon, level: level });
  }

  return (
    <div className="flex gap-2 items-center">
      <label className="input flex bg-base text-base-content justify-center items-center w-48">
        <p className="flex-1">Level: </p>
        <input
          className="flex-none w-16"
          type="number"
          value={userPokemon.level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
        />
      </label>
      <p className="text-sm">(Only effects your moves)</p>
    </div>
  );
}
