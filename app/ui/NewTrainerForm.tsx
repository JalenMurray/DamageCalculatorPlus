'use client';

import { useRef, useState } from 'react';
import {
  Abilities,
  HeldItem,
  Move,
  Nature,
  Pokemon,
  PokemonFormData,
  PokemonGame,
  TrainerFormData,
  TrainerSprite,
} from '../pokemon-data/definitions';
import TrainerSpriteSelect from './TrainerSpriteSelect';
import Image from 'next/image';
import GameSelect from './GameSelect';
import SideDrawer from './SideDrawer';
import { AddCircleOutline } from '@mui/icons-material';
import clsx from 'clsx';
import BattlePokemonBuilder from './BattlePokemonBuilder';
import NewBattlePokemonDisplay from './NewBattlePokemonDisplay';
import { createTrainerHelper } from '../lib/actions';
import { redirect } from 'next/navigation';

export default function NewTrainerForm({
  games,
  pokemon,
  heldItems,
  moves,
  trainerSprites,
  natures,
  abilities,
}: {
  games: PokemonGame[];
  pokemon: Pokemon[];
  heldItems: HeldItem[];
  moves: Move[];
  trainerSprites: TrainerSprite[];
  natures: Nature[];
  abilities: Abilities;
}) {
  const [formData, setFormData] = useState<TrainerFormData>({
    name: '',
    sprite: trainerSprites[0],
    pokemon: [],
    moves: [],
    game: games[0],
    cardColor: '#FF0000',
  });

  function setSprite(sprite: TrainerSprite) {
    const drawerToggle = document.getElementById('trainer-sprite-select') as HTMLInputElement;
    drawerToggle.checked = !drawerToggle.checked;
    setFormData((prev) => ({ ...prev, sprite }));
  }

  function setGame(game: PokemonGame) {
    const drawerToggle = document.getElementById('game-select') as HTMLInputElement;
    drawerToggle.checked = !drawerToggle.checked;
    setFormData((prev) => ({ ...prev, game }));
  }

  function validColor(color: string) {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    return hexColorRegex.test(color);
  }

  function handleAddPokemon(pokemon: PokemonFormData, moves: Move[]) {
    const drawerToggle = document.getElementById('new-pokemon-select') as HTMLInputElement;
    drawerToggle.checked = !drawerToggle.checked;
    const newPokemonList = [...formData.pokemon, pokemon];
    const newMovesList = [...formData.moves, { moves, pokemon: pokemon.pokemon }];
    setFormData((prev) => ({ ...prev, pokemon: newPokemonList, moves: newMovesList }));
    console.log('Adding New Pokemon', pokemon);
    console.log('With Moves', moves);
  }

  async function handleCreateTrainer() {
    await createTrainerHelper(formData);
    setFormData({
      name: '',
      sprite: trainerSprites[0],
      pokemon: [],
      moves: [],
      game: games[0],
      cardColor: '#FF0000',
    });
  }

  return (
    <>
      <div className="flex flex-col gap-8 text-base-content">
        <h1 className="text-6xl">New Trainer</h1>
        <label className="input border-primary flex items-center gap-2 w-[500px]">
          Name:
          <input
            type="text"
            className="pl-4 grow"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />
        </label>
        <label
          className="input border-primary drawer-button flex items-center gap-2 w-[300px] h-[100px] cursor-pointer"
          htmlFor="trainer-sprite-select"
        >
          Sprite:
          <Image
            src={`https://play.pokemonshowdown.com/sprites/trainers/${formData.sprite.url}`}
            alt={formData.sprite.name}
            width={75}
            height={75}
          />
          {formData.sprite.name}
        </label>
        <label
          className="input border-primary drawer-button flex items-center gap-2 w-[300px] cursor-pointer"
          htmlFor="game-select"
        >
          Game: {formData.game.name}
        </label>
        <label className="input border-primary flex items-center gap-2 w-[500px]">
          Card Color:
          <div
            className={clsx('h-8 w-8 mx-4', { skeleton: !validColor(formData.cardColor) })}
            style={{
              backgroundColor: validColor(formData.cardColor) ? formData.cardColor : undefined,
              borderRadius: 0,
            }}
          />
          <input
            type="text"
            className="grow"
            value={formData.cardColor}
            onChange={(e) => setFormData((prev) => ({ ...prev, cardColor: e.target.value }))}
          />
        </label>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl">Pokemon</h1>
          <label
            className="btn btn-primary w-48 text-primary-content drawer-button"
            htmlFor="new-pokemon-select"
            // disabled={formData.pokemon.length >= 6}
          >
            <AddCircleOutline />
            New Pokemon
          </label>
          <div className="grid grid-cols-3 gap-4 mb-12">
            {formData.pokemon &&
              formData.pokemon.map((pokemon, i) => (
                <NewBattlePokemonDisplay pokemon={pokemon} moves={formData.moves[i]} />
              ))}
          </div>
        </div>
        <button className="btn btn-success" onClick={handleCreateTrainer}>
          Create Trainer
        </button>
      </div>
      <SideDrawer id="trainer-sprite-select">
        <TrainerSpriteSelect sprites={trainerSprites} onSelect={setSprite} />
      </SideDrawer>
      <SideDrawer id="game-select">
        <GameSelect games={games} onSelect={setGame} />
      </SideDrawer>
      <SideDrawer id="new-pokemon-select">
        <BattlePokemonBuilder
          pokemon={pokemon}
          heldItems={heldItems}
          natures={natures}
          onAdd={handleAddPokemon}
          moves={moves}
          abilities={abilities}
        />
      </SideDrawer>
    </>
  );
}
