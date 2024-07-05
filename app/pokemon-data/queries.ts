import { db } from './pokemon-data';

export type Stats = {
  hp: { name: string; value: number };
  attack: { name: string; value: number };
  defense: { name: string; value: number };
  specialAttack: { name: string; value: number };
  specialDefense: { name: string; value: number };
  speed: { name: string; value: number };
};

export type Abilities = string[];

export type Type = {
  name: string;
  color: string;
};

export type Pokemon = {
  id: number;
  name: string;
  stats: Stats;
  abilities: Abilities;
  types: Type[];
  weight: number | null;
};

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
    const { id, name, hp, attack, defense, specialAttack, specialDefense, speed, weight } = pokemon;
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
      abilities: pokemon?.pokemonAbilities.map((ability) => ability.ability.name),
      types: pokemon?.pokemonTypes.map((type) => ({
        name: type.type.name,
        color: type.type.color,
      })),
    };
  });
  return allPokemon;
}
