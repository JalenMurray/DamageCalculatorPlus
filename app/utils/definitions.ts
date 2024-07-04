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

export type AttackerInput = {
  level: number; // Level of the attacking pokemon
  attack: number; // Attack or Special Attack of the attacking pokemon
  ability: string; // Ability of the pokemon
  pokemonType: PokemonType[]; // Pokemon Types
  moveType: PokemonType; // Used move type
  moveName: string; // Name of the move used
  movePower: number; // Used move power
  wasPhysical: boolean; // Whether or not the move was physical
  burn?: boolean; // Whether or not the attacker is burnt
};

export type DefenderInput = {
  level: number;
  defense: number;
  hp: number;
  ability: string;
  pokemonType: PokemonType[];
};

export type DamageInfoInput = {
  attacker: AttackerInput;
  defender: DefenderInput;
  weather?: 'rain' | 'harsh sunlight'; // Weather
  glaiveRush?: boolean; // Whether or not Glaive Rush
};

export type DamageInfoOutput = {
  floor: number; // The minimum damage it can do
  ceiling: number; // The maxmimum damage it can do
  critFloor: number; // The mimimum damage it can do with crit
  critCeiling: number; // The maximum damage it can do with crit
};
