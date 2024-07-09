import { CalculatorContext } from '@/app/context/calculator';
import { Type } from '@/app/pokemon-data/definitions';
import { useContext } from 'react';

export default function TypeInput() {
  const { userPokemon, setUserPokemon, allTypes } = useContext(CalculatorContext);

  function addType(type: Type) {
    const { types } = userPokemon;
    if (types.length === 2) {
      return;
    }
    setUserPokemon({ ...userPokemon, types: [...types, type] });
  }

  function removeType(type: Type) {
    const { types } = userPokemon;
    const removed = types.filter((t) => t.name !== type.name);
    setUserPokemon({ ...userPokemon, types: removed });
  }

  function handleSelect(type: Type, action: 'remove' | 'add') {
    action === 'add' ? addType(type) : removeType(type);
  }

  function hasType(type: Type): boolean {
    const result = userPokemon.types.reduce<boolean>((acc, curr) => {
      if (acc) {
        return acc;
      }
      if (curr.name === type.name) {
        return true;
      }
      return acc;
    }, false);
    return result;
  }

  return (
    <div className="flex flex-col gap-4">
      <h1>Select the Type(s) of your pokemon</h1>
      {allTypes ? (
        <div className="grid grid-cols-6 gap-2">
          {allTypes.map((type) => (
            <div className="indicator w-full" key={type.id}>
              {hasType(type) && <div className="indicator-item badge badge-primary" />}
              <div
                className="card border-base-300 w-full h-[50px] p-4 text-white justify-center items-center text-center cursor-pointer"
                style={{ backgroundColor: type.color }}
                onClick={() => handleSelect(type, hasType(type) ? 'remove' : 'add')}
              >
                {type.name}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="skeleton h-64 w-full" />
      )}
    </div>
  );
}
