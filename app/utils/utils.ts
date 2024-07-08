import { Pokemon, Type, PokemonType, BattlePokemon } from '../pokemon-data/definitions';
import { getStat } from './formulas';

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTypeStrs(types: Type[]): PokemonType[] {
  return types.map((type) => type.name);
}

export function removeDash(name: string) {
  return name.replace('-', '');
}

export function getSpriteURL(name: string): string {
  return `https://play.pokemonshowdown.com/sprites/xyani/${removeDash(name)}.gif`;
}

export function getTypeURL(type: string): string {
  return `https://play.pokemonshowdown.com/sprites/types/${capitalize(type)}.png`;
}

export function getTypeGradient(
  types: Type[],
  displayType: string
): {
  backgroundImage: string;
  backgroundBlendMode?: string;
} {
  if (types.length === 1) {
    return {
      backgroundImage: `linear-gradient(to right, black, ${types[0].color}`,
    };
  } else {
    const blackGradient =
      displayType === 'modal'
        ? 'linear-gradient(to right, black 10%, rgba(0, 0, 0, 0.5) 20%, transparent 30%)'
        : 'linear-gradient(to right, black, transparent)';
    return {
      backgroundImage: `${blackGradient}, linear-gradient(to right, ${types[1].color}, ${types[0].color})`,
      backgroundBlendMode: 'multiply',
    };
  }
}

export function getStatByIndex(index: number): string {
  switch (index) {
    case 0:
      return 'HP';
    case 1:
      return 'Att';
    case 2:
      return 'Def';
    case 3:
      return 'Sp. Att';
    case 4:
      return 'Sp. Def';
    case 5:
      return 'Speed';
    default:
      return 'Invalid';
  }
}

export function formatDashName(name: string): string {
  const noDashes = name.replace('-', ' ');
  const words = noDashes.split(' ');
  return words.map((word) => capitalize(word)).join(' ');
}

export function getBattlePokemonStats(
  pokemon: BattlePokemon,
  ivs: number[],
  evs: number[]
): { name: string; ceiling: number; floor: number; avg: number }[] {
  const { level } = pokemon;
  const { stats } = pokemon.pokemon;
  function getNonHPStats(i: number, stat: number) {
    const ceiling = getStat(false, level, ivs[i], evs[i], stat, 1.1);
    const floor = getStat(false, level, ivs[i], evs[i], stat, 0.9);
    const avg = getStat(false, level, ivs[i], evs[i], stat, 1);
    return { ceiling, floor, avg };
  }

  function getHPStats() {
    const iv = ivs[0];
    const ev = evs[0];
    const stat = stats.hp.value;

    const ceiling = getStat(true, level, iv, ev, stat, 1.1);
    const floor = getStat(true, level, iv, ev, stat, 0.9);
    const avg = getStat(true, level, iv, ev, stat, 1);
    return { ceiling, floor, avg };
  }

  const hp = {
    name: 'hp',
    ...getHPStats(),
  };
  const attack = {
    name: 'attack',
    ...getNonHPStats(1, stats.attack.value),
  };
  const defense = {
    name: 'defense',
    ...getNonHPStats(2, stats.defense.value),
  };
  const specialAttack = {
    name: 'specialAttack',
    ...getNonHPStats(3, stats.specialAttack.value),
  };
  const specialDefense = {
    name: 'specialDefense',
    ...getNonHPStats(4, stats.specialDefense.value),
  };
  const speed = {
    name: 'speed',
    ...getNonHPStats(5, stats.speed.value),
  };

  return [hp, attack, defense, specialAttack, specialDefense, speed];
}

interface ObjWithName {
  name: string;
}

export function sortByName(arr: ObjWithName[]) {
  return arr.sort((a, b) => a.name.localeCompare(b.name));
}
