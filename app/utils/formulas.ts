// Damage Formula image found in DamageFormula.png

import { DamageInfoInput, DamageInfoOutput } from './definitions';
import {
  MIN_RANDOM,
  MAX_RANDOM,
  WEATHER_ABILITIES,
  CRITICAL_ABILITIES,
  CRITICAL_MOVES,
} from './constants';
import { typeMatchups } from '../pokemon-data/pokemon-data';

function getParenthesisFormula(input: DamageInfoInput): number {
  const { level, movePower, attack } = input.attacker;
  const { defense } = input.defender;
  const topFrac = ((2 * level) / 5 + 2) * movePower * (attack / defense);
  const bottomFrac = 50;
  return topFrac / bottomFrac + 2;
}

function getWeatherNumber(input: DamageInfoInput): number {
  const { weather } = input;
  const { moveType, moveName, ability: a } = input.attacker;
  const { ability: a2 } = input.defender;

  // If either pokemon has Cloud Nine or Air Lock return 1
  if (WEATHER_ABILITIES.includes(a) || WEATHER_ABILITIES.includes(a2)) {
    return 1;
  }

  if (weather === 'rain') {
    // In rain 1.5 to water moves and .5 to fire moves
    if (moveType === 'water') {
      return 1.5;
    }
    if (moveType === 'fire') {
      return 0.5;
    }
  }
  if (weather === 'harsh sunlight') {
    // In harsh sunlight 1.5 to fire moves and hydro steam and .5 to water moves
    if (moveType === 'fire' || moveName === 'hydro-steam') {
      return 1.5;
    }
    if (moveType === 'water') {
      return 0.5;
    }
  }

  return 1;
}

function getCriticalNumber(input: DamageInfoInput): number {
  const { ability } = input.defender;
  const { moveName } = input.attacker;
  if (CRITICAL_ABILITIES.includes(ability)) {
    return 1;
  }
  if (CRITICAL_MOVES.includes(moveName)) {
    return 1.5;
  }
  return 1;
}

function getStabNumber(input: DamageInfoInput): number {
  const { ability, moveType, pokemonType } = input.attacker;
  if (ability === 'adaptability') {
    return 2;
  }
  if (pokemonType.includes(moveType)) {
    return 1.5;
  }
  return 1;
}

function getTypeNumber(input: DamageInfoInput): number {
  const { moveType } = input.attacker;
  const { pokemonType } = input.defender;
  let typeNumber: number = 1;
  pokemonType.forEach((type) => {
    typeNumber *= typeMatchups[moveType][type];
  });

  return typeNumber;
}

function getBurnNumber(input: DamageInfoInput): number {
  const { burn, ability, wasPhysical, moveName } = input.attacker;
  if (burn && wasPhysical && ability !== 'guts' && moveName !== 'facade') {
    return 0.5;
  }
  return 1;
}

export function getDamageRange(input: DamageInfoInput): DamageInfoOutput | undefined {
  const parens = getParenthesisFormula(input);
  const weather = getWeatherNumber(input);
  const crit = getCriticalNumber(input);
  const stab = getStabNumber(input);
  const type = getTypeNumber(input);

  return undefined;
}
