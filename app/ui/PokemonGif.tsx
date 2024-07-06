import { useEffect, useState } from 'react';
import { getSpriteURL } from '../utils/utils';

export default function PokemonGif({ name, extraProps }: { name: string; extraProps?: any }) {
  const [src, setSrc] = useState(getSpriteURL(name));
  const fallbackSrc = 'https://play.pokemonshowdown.com/sprites/substitutes/gen5/substitute.png';

  function checkImage(url: string) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => reject(false);
      img.src = url;
    });
  }

  useEffect(() => {
    const url = getSpriteURL(name);
    checkImage(url)
      .then(() => setSrc(url))
      .catch(() => setSrc(fallbackSrc));
  }, [name]);

  function handleError() {
    console.log(`Error loading image for ${name}, switching to fallback`);
    setSrc(fallbackSrc);
  }

  return (
    <img
      src={src}
      alt={name.charAt(0).toUpperCase() + name.slice(1)}
      onError={handleError}
      {...extraProps}
    />
  );
}
