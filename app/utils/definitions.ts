import { Move, Pokemon, Type } from '../pokemon-data/definitions';

export type Stats = {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
};

export type AttackerInput = {
  level: number;
  types: Type[];
  move: Move;
  attack: number;
  ability: string; // Ability of the pokemon
  burn?: boolean; // Whether or not the attacker is burnt
};

export type DefenderInput = {
  hp: number;
  defense: number;
  ability: string;
  types: Type[];
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
