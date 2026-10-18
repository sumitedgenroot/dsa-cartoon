"use client";

import dynamic from "next/dynamic";

const Loading = () => <div className="card p-10 text-center font-hand text-2xl">Loading game… 🎮</div>;

const GAMES: Record<string, React.ComponentType> = {
  "big-o-battle": dynamic(() => import("./BigOBattle"), { loading: Loading }),
  "pattern-detective": dynamic(() => import("./PatternDetective"), { loading: Loading }),
  "number-guess": dynamic(() => import("./NumberGuess"), { loading: Loading }),
  "bracket-rush": dynamic(() => import("./BracketRush"), { loading: Loading }),
  hanoi: dynamic(() => import("./Hanoi"), { loading: Loading }),
  "n-queens": dynamic(() => import("./NQueens"), { loading: Loading }),
  "maze-race": dynamic(() => import("./MazeRace"), { loading: Loading }),
  "coin-change": dynamic(() => import("./CoinCashier"), { loading: Loading }),
  "bit-flipper": dynamic(() => import("./BitFlipper"), { loading: Loading }),
  "heap-builder": dynamic(() => import("./HeapHero"), { loading: Loading }),
};

export function GameSwitch({ slug }: { slug: string }) {
  const Game = GAMES[slug];
  return Game ? <Game /> : null;
}
