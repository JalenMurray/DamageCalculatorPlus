import { CalculatorContext } from '@/app/context/calculator';
import { Move, typeColors } from '@/app/pokemon-data/definitions';
import { formatDashName, getDamageClassURL, getTypeURL } from '@/app/utils/utils';
import { AddCircleOutline } from '@mui/icons-material';
import Image from 'next/image';
import { useContext, useEffect, useState } from 'react';

export default function MoveInput() {
  const { userPokemon, setUserPokemon, userMoveOutputs } = useContext(CalculatorContext);

  function removeMove(toRemove: Move) {
    const removed = userPokemon.moves.filter((move) => move.id !== toRemove.id);
    setUserPokemon({ ...userPokemon, moves: removed });
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">Select Moves</h1>
      <p>You can input up to 10 moves to see their damage outputs</p>
      <button className="btn btn-primary">
        <label className="drawer-button cursor-pointer w-full" htmlFor="new-move-select">
          <AddCircleOutline /> Add Moves
        </label>
      </button>
      <div className="flex flex-col gap-4">
        {userPokemon.moves.map((move, i) => (
          <div
            className=" card w-full h-[100px] cursor-pointer"
            style={{
              backgroundColor: `${typeColors[move.type]}`,
            }}
            onClick={() => removeMove(move)}
          >
            <div className="card w-auto h-full m-2 bg-neutral text-neutral-content p-4">
              <div className="grid grid-cols-2">
                <div className="flex flex-col">
                  <div className="flex gap-4 items-center">
                    <h1 className="text-xl">{formatDashName(move.name)}</h1>
                    <div>
                      <Image
                        src={getTypeURL(move.type)}
                        alt={`${move.type} type`}
                        width={50}
                        height={20}
                        key={move.type}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Image
                      src={getDamageClassURL(move)}
                      alt={move.damageClass}
                      width={50}
                      height={25}
                    />
                    <p>Power: {move.power || '--'}</p>
                    <p>Accuracy: {move.accuracy || '--'}</p>
                    {move.priority !== 0 && <p>Priority: {move.priority}</p>}
                  </div>
                </div>
                {userMoveOutputs[i] ? (
                  <div className="text-center my-auto">
                    <h1
                      className="text-2xl font-bold"
                      style={
                        userMoveOutputs[i].floor > 100 || userMoveOutputs[i].ceiling > 100
                          ? { color: 'green' }
                          : undefined
                      }
                    >
                      {userMoveOutputs[i].floor.toFixed(2)}% -{' '}
                      {userMoveOutputs[i].ceiling.toFixed(2)}%
                    </h1>
                  </div>
                ) : (
                  <div className="skeleton h-12 w-full" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
