import {
  Move,
  Pokemon,
  Trainer,
  PokemonType,
  PokemonGame,
  HeldItem,
  TrainerSprite,
  BattlePokemon,
  Nature,
  Abilities,
  TrainerFormData,
} from './definitions';
import { db } from './pokemon-data';
import { battlePokemon, battlePokemonMoves, trainers } from './schema';

function getFormattedPokemon(pokemon: any): Pokemon {
  const { id, name, hp, attack, defense, specialAttack, specialDefense, speed, weight } = pokemon;
  const abilities = pokemon.pokemonAbilities;
  const types = pokemon.pokemonTypes;
  return {
    id,
    name,
    stats: {
      hp: { name: 'HP', value: hp },
      attack: { name: 'Attack', value: attack },
      defense: { name: 'Defense', value: defense },
      specialAttack: { name: 'Special Attack', value: specialAttack },
      specialDefense: { name: 'Special Defense', value: specialDefense },
      speed: { name: 'Speed', value: speed },
    },

    weight,
    abilities: abilities
      ? abilities.map((ability: { ability: { name: string } }) => ability.ability.name)
      : [],
    types: types
      ? types.map((type: { type: { name: string; color: string } }) => ({
          name: type.type.name.toLowerCase() as PokemonType,
          color: type.type.color,
        }))
      : [],
  } as Pokemon;
}

export async function getAllPokemon(): Promise<Pokemon[]> {
  const result = await db.query.pokemon.findMany({
    with: {
      pokemonAbilities: {
        columns: {},
        with: {
          ability: {
            columns: { id: false },
          },
        },
      },
      pokemonTypes: {
        columns: {},
        with: {
          type: {
            columns: { id: false },
          },
        },
      },
    },
  });
  const allPokemon = result.map((pokemon) => {
    return getFormattedPokemon(pokemon);
  });
  return allPokemon;
}

export async function getAllMoves(): Promise<Move[]> {
  const result = await db.query.moves.findMany();
  return result.map((move) => ({ ...move, type: move.type as PokemonType }));
}

export async function getAllGames(): Promise<PokemonGame[]> {
  const result = await db.query.pokemonGames.findMany();
  return result;
}

export async function getAllHeldItems(): Promise<HeldItem[]> {
  const result = await db.query.heldItems.findMany();
  return result;
}

export async function getAllTrainerSprites(): Promise<TrainerSprite[]> {
  const result = await db.query.trainerSprites.findMany();
  return result;
}

export async function getTrainers(): Promise<Trainer[]> {
  const result = await db.query.trainers.findMany({
    with: {
      battlePokemon: {
        columns: { trainer: false },
        with: {
          moves: {
            columns: {},
            with: {
              move: true,
            },
          },
          pokemon: {
            with: {
              pokemonTypes: {
                columns: {},
                with: {
                  type: {
                    columns: { id: false },
                  },
                },
              },
            },
          },
          ability: {
            columns: { name: true },
          },
          heldItem: true,
          nature: true,
        },
      },
      pokemonGame: true,
      sprite: true,
    },
  });

  const formattedTrainers = result.map((trainer) => {
    const { id, name, sprite, pokemonGame, battlePokemon, cardColor } = trainer;
    const trainerInfo = { id, name, sprite, pokemonGame, cardColor };
    const battlePokemonInfo = battlePokemon.map((bp: any) => {
      const { id, level, pokemon, ability, heldItem, moves, ivs, evs, nature } = bp;
      const pokemonInfo = { id, level, pokemon, ability: ability.name, heldItem, ivs, evs, nature };
      const formattedPokemon = getFormattedPokemon(pokemon);
      const movesInfo = moves.map((move: any) => ({
        ...move.move,
        type: move.move.type as PokemonType,
      }));
      return { ...pokemonInfo, pokemon: formattedPokemon, moves: movesInfo } as BattlePokemon;
    });

    return { ...trainerInfo, pokemon: battlePokemonInfo } as Trainer;
  });

  return formattedTrainers;
}

export async function getAllNatures(): Promise<Nature[]> {
  const result = await db.query.natures.findMany();
  return result;
}

export async function getAllAbilities(): Promise<Abilities> {
  const result = await db.query.abilities.findMany();
  return result;
}

export async function createTrainer(input: TrainerFormData) {
  const { name, sprite, cardColor, game, pokemon, moves } = input;
  const trainerInfo = {
    name,
    sprite: sprite.id,
    cardColor,
    pokemonGame: game.id,
  };
  const newTrainer = await db.insert(trainers).values(trainerInfo).returning();
  const { id } = newTrainer[0];
  const pokemonInfo = pokemon.map((p) => ({
    pokemon: p.pokemon.id,
    level: p.level,
    evs: p.evs,
    ivs: p.ivs,
    ability: p.ability.id,
    nature: p.nature.id,
    trainer: id,
    held_item: p.heldItem?.id || null,
  }));
  const newPokemon = await db.insert(battlePokemon).values(pokemonInfo).returning();
  const moveInfo = newPokemon.map(({ id }, i) => {
    const pokemonMoves = moves[i];
    const toAdd = pokemonMoves.moves.map((move) => ({
      pokemon: id,
      move: move.id,
    }));
    return toAdd;
  });
  const addMoves = moveInfo.map(async (movesInfo) => {
    await db.insert(battlePokemonMoves).values(movesInfo);
  });

  await Promise.all(addMoves);
}
