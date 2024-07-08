// Damage Formula image found in DamageFormula.png

import { DamageInfoInput, DamageInfoOutput } from './definitions';
import {
  MIN_RANDOM,
  MAX_RANDOM,
  WEATHER_ABILITIES,
  CRITICAL_ABILITIES,
  CRITICAL_MOVES,
  typeMatchups,
} from './constants';
import { getTypeStrs } from './utils';

export function getStat(
  isHP: boolean,
  level: number,
  iv: number,
  ev: number,
  base: number,
  nature: number
): number {
  if (isHP) {
    return Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * level) + level + 10;
  } else {
    return Math.floor(
      (Math.floor(0.01 * (2 * base + iv + Math.floor(0.25 * ev)) * level) + 5) * nature
    );
  }
}

function getParenthesisFormula(input: DamageInfoInput): number {
  const { move, attack, level } = input.attacker;
  const { defense } = input.defender;
  const { power, damageClass } = move;

  // If the move is a status move or does not have a power, return 0
  if (!power || damageClass === 'status') {
    return 0;
  }

  const a = Math.floor((2 * level) / 5) + 2;
  const b = a * power;
  const c = b * attack;
  const d = Math.floor(c / defense);
  const e = Math.floor(d / 50);
  const f = e + 2;

  return f;
}

function getWeatherNumber(input: DamageInfoInput): number {
  const { weather } = input;
  const { move, ability: a1 } = input.attacker;
  const { ability: a2 } = input.defender;
  const { name, type } = move;

  // If either pokemon has Cloud Nine or Air Lock return 1
  if (WEATHER_ABILITIES.includes(a1) || WEATHER_ABILITIES.includes(a2)) {
    return 1;
  }

  if (weather === 'rain') {
    // In rain 1.5 to water moves and .5 to fire moves
    if (type === 'water') {
      return 1.5;
    }
    if (type === 'fire') {
      return 0.5;
    }
  }
  if (weather === 'harsh sunlight') {
    // In harsh sunlight 1.5 to fire moves and hydro steam and .5 to water moves
    if (type === 'fire' || name === 'hydro-steam') {
      return 1.5;
    }
    if (type === 'water') {
      return 0.5;
    }
  }

  return 1;
}

function getCriticalNumber(input: DamageInfoInput): number {
  const { ability } = input.defender;
  const { name } = input.attacker.move;
  if (CRITICAL_ABILITIES.includes(ability)) {
    return 1;
  }
  if (CRITICAL_MOVES.includes(name)) {
    return 1.5;
  }
  return 1;
}

function getStabNumber(input: DamageInfoInput): number {
  const { ability, move, types: pokemonTypes } = input.attacker;
  const { type: moveType } = move;

  const pokemonTypeStrings = getTypeStrs(pokemonTypes);

  if (ability === 'adaptability') {
    return 2;
  }
  if (pokemonTypeStrings.includes(moveType)) {
    return 1.5;
  }
  return 1;
}

function getTypeNumber(input: DamageInfoInput): number {
  const { type: moveType } = input.attacker.move;
  const { types: pokemonTypes } = input.defender;

  const pokemonTypeStrs = getTypeStrs(pokemonTypes);

  let typeNumber: number = 1;
  pokemonTypeStrs.forEach((type) => {
    typeNumber *= typeMatchups[moveType][type];
  });

  return typeNumber;
}

function getBurnNumber(input: DamageInfoInput): number {
  const { burn, ability, move } = input.attacker;
  const { damageClass, name: moveName } = move;
  if (burn && damageClass === 'physical' && ability !== 'guts' && moveName !== 'facade') {
    return 0.5;
  }
  return 1;
}

export function getDamageRange(input: DamageInfoInput): DamageInfoOutput {
  const parens = getParenthesisFormula(input);
  const weather = getWeatherNumber(input);
  const crit = getCriticalNumber(input);
  const stab = getStabNumber(input);
  const type = getTypeNumber(input);
  const burn = getBurnNumber(input);

  const baseDmg = Math.floor(
    Math.floor(Math.floor(Math.floor(Math.floor(parens * weather) * crit) * stab) * type) * burn
  );

  // console.log(`Processing Attack From`, input.attacker);
  // console.log(`To:`, input.defender);
  // console.log(`Using Move ${input.attacker.move.name}`);

  const maxDmg = Math.floor(baseDmg * MAX_RANDOM);
  const minDmg = Math.floor(baseDmg * MIN_RANDOM);

  // console.log('Max Dmg', maxDmg);
  // console.log('Min Dmg', minDmg);

  const defenderHP = input.defender.hp;

  const ceiling = (maxDmg / defenderHP) * 100;

  const floor = (minDmg / defenderHP) * 100;

  return {
    floor,
    ceiling,
    critFloor: floor,
    critCeiling: ceiling,
  };
}
