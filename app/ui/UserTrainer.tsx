'use client';

import Image from 'next/image';
import { BattlePokemon as BPType, Trainer } from '../pokemon-data/definitions';
import { getSpriteURL } from '../utils/utils';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import BattlePokemon from './BattlePokemon';
import { CalculatorContext } from '../context/calculator';

function TrainerHeader({ trainer }: { trainer: Trainer }) {
  return (
    <div className="flex justify-between items-center h-[100px] px-6 border-b-2 border-b-white">
      <h1 className="text-4xl">Jalen</h1>
      <div className="crop-bottom">
        <Image
          src={'https://play.pokemonshowdown.com/sprites/trainers/n.png'}
          alt={trainer.name}
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}

function TrainerPokemonSelector({
  trainer,
  onSelect,
}: {
  trainer: Trainer;
  onSelect: (index: number) => void;
}) {
  const [selectedPokemon, setSelectedPokemon] = useState<number>(0);

  function handleSelect(index: number) {
    setSelectedPokemon(index);
    onSelect(index);
  }

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {trainer.pokemon.map((bp, i) => (
        <div
          className={clsx(
            'border-2 rounded-full border-white h-[120px] w-[120px] flex items-center justify-center cursor-pointer',
            { 'bg-primary': i === selectedPokemon }
          )}
          onClick={() => handleSelect(i)}
        >
          <Image
            src={getSpriteURL(bp.pokemon.name)}
            alt={bp.pokemon.name}
            width={50}
            height={50}
            unoptimized
            style={{ objectFit: 'contain', objectPosition: 'center' }}
            className="w-full h-full p-4"
          />
        </div>
      ))}
    </div>
  );
}

export default function UserTrainer({ trainer }: { trainer: Trainer }) {
  const { userPokemon, setUserPokemon } = useContext(CalculatorContext);

  useEffect(() => {
    setUserPokemon(trainer.pokemon[0]);
  }, [trainer]);

  function handlePokemonSelected(index: number) {
    const pokemon = trainer.pokemon[index];
    setUserPokemon(pokemon);
  }

  return (
    <div className="card w-full h-[1080px] border-2 border-base-content rounded-2xl text-white bg-neutral-content">
      <TrainerHeader trainer={trainer} />
      <div className="grid grid-cols-5 h-[900px]">
        <TrainerPokemonSelector
          trainer={trainer}
          onSelect={(i: number) => handlePokemonSelected(i)}
        />
        <div className="col-span-4 flex justify-center items-center p-12">
          <BattlePokemon pokemon={userPokemon} user />
        </div>
      </div>
    </div>
  );
}
