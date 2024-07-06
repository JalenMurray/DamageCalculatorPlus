import { Move, Pokemon, Trainer, PokemonType } from './definitions';
import { db } from './pokemon-data';

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
        },
      },
      pokemonGame: true,
    },
  });

  const formattedTrainers = result.map((trainer) => {
    const { id, name, sprite, pokemonGame, battlePokemon, cardColor } = trainer;
    const trainerInfo = { id, name, sprite, pokemonGame, cardColor };
    const battlePokemonInfo = battlePokemon.map((bp) => {
      const { id, level, pokemon, ability, heldItem, moves } = bp;
      const pokemonInfo = { id, level, pokemon, ability: ability.name, heldItem };
      const formattedPokemon = getFormattedPokemon(pokemon);
      const movesInfo = moves.map((move) => ({
        ...move.move,
        type: move.move.type as PokemonType,
      }));
      return { ...pokemonInfo, pokemon: formattedPokemon, moves: movesInfo };
    });

    return { ...trainerInfo, pokemon: battlePokemonInfo } as Trainer;
  });

  return formattedTrainers;
}
