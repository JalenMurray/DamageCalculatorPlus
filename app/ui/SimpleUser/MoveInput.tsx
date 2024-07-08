import { Move } from '@/app/pokemon-data/definitions';
import { AddCircleOutline } from '@mui/icons-material';
import { useState } from 'react';

export default function MoveInput({ moves }: { moves: Move[] }) {
  const [userMoves, setUserMoves] = useState<Move[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl">Select Moves</h1>
      <p>You can input up to 10 moves to see their damage outputs</p>
      <button className="btn btn-primary">
        <label className="drawer-button cursor-pointer w-full" htmlFor="new-move-select">
          <AddCircleOutline /> Add Move
        </label>
      </button>
    </div>
  );
}
