export type PokemonType =
  | 'normal'
  | 'fire'
  | 'water'
  | 'electric'
  | 'grass'
  | 'ice'
  | 'fighting'
  | 'poison'
  | 'ground'
  | 'flying'
  | 'psychic'
  | 'bug'
  | 'rock'
  | 'ghost'
  | 'dragon'
  | 'dark'
  | 'steel'
  | 'fairy';

export type StatName = 'HP' | 'Attack' | 'Defense' | 'Special Attack' | 'Special Defense' | 'Speed';

export type Stats = {
  hp: { name: StatName; value: number };
  attack: { name: StatName; value: number };
  defense: { name: StatName; value: number };
  specialAttack: { name: StatName; value: number };
  specialDefense: { name: StatName; value: number };
  speed: { name: StatName; value: number };
};

export type Ability = {
  id: number;
  name: string;
};

export type Abilities = Ability[];

export type Type = {
  id: number;
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

export type Move = {
  id: number;
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
  priority: number;
  type: PokemonType;
  damageClass: 'physical' | 'special' | 'status';
};

export type PokemonGame = {
  id: number;
  name: string;
};

export type HeldItem = {
  id: number;
  name: string;
  sprite: string;
};

export type Nature = {
  id: number;
  name: string;
  increases?: string | null;
  decreases?: string | null;
};

export type BattlePokemon = {
  pokemon: Pokemon;
  ability: string;
  heldItem: HeldItem;
  level: number;
  moves: Move[];
  ivs: number[];
  evs: number[];
  nature: Nature;
};

export type Trainer = {
  id: number;
  name: string;
  sprite: TrainerSprite;
  pokemonGame: PokemonGame;
  pokemon: BattlePokemon[];
  cardColor: string;
};

export type TrainerSprite = {
  id: number;
  name: string;
  url: string;
};

export const typeColors = {
  normal: '#AAAA99',
  fire: '#FF4422',
  water: '#3399FF',
  electric: '#FFCC33',
  grass: '#77CC55',
  ice: '#66CCFF',
  fighting: '#AE4F3F',
  poison: '#AA5599',
  ground: '#DDBB55',
  flying: '#8899FF',
  psychic: '#FF5599',
  bug: '#AABB22',
  rock: '#BBAA66',
  ghost: '#5D5DAA',
  dragon: '#7766EE',
  dark: '#775544',
  steel: '#AAAABB',
  fairy: '#EE99EE',
};

export type PokemonFormData = {
  pokemon: Pokemon;
  ability: Ability;
  level: number;
  evs: number[];
  ivs: number[];
  heldItem?: HeldItem | null;
  nature: Nature;
};

export type BattlePokemonMoveFormData = {
  moves: Move[];
  pokemon: Pokemon;
};

export type TrainerFormData = {
  sprite: TrainerSprite;
  name: string;
  game: PokemonGame;
  cardColor: string;
  pokemon: PokemonFormData[];
  moves: BattlePokemonMoveFormData[];
};
