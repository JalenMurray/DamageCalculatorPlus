import { CalculatorContext } from '@/app/context/calculator';
import { useContext } from 'react';

export default function TypeInput() {
  const { userPokemon, setUserPokemon } = useContext(CalculatorContext);

  function handleSelect(type: string) {}

  return (
    <div className="flex flex-col gap-4">
      <h1>Select the Type(s) of your pokemon</h1>
    </div>
  );
}
