import type { ReactNode } from 'react';
import './GameStage.css';

export function GameStage({ id, children }: { id: string; children: ReactNode }) {
  return (
    <div className="kz-stage" data-game={id}>
      <div className="kz-stage-scenery" aria-hidden="true"><span /><span /><span /></div>
      <div className="kz-stage-play">{children}</div>
    </div>
  );
}
