import { CHANGE_BALL_COLOR } from "./boardAT";
import { BallInfo } from "../ui/Board";
import { PayloadAction } from "@reduxjs/toolkit";
interface Ball {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  isWhiteBall: boolean;
}

const colors = ["red", "pink", "blue", "yellow", "purple"];
function randomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}
function randomRadius(): number {
  return Math.random() * 20 + 12;
}

export interface BallsState {
  ballsInfo: Ball[];
}

const initialState: BallsState = {
  ballsInfo: [
    {
      id: 999,
      x: 400,
      y: 250,
      dx: 0,
      dy: 0,
      radius: 20,
      color: "white",
      isWhiteBall: true,
    },
    {
      id: 1,
      x: 500,
      y: 250,
      dx: 0,
      dy: 0,
      radius: randomRadius(),
      color: randomColor(),
      isWhiteBall: false,
    },
    {
      id: 2,
      x: 550,
      y: 200,
      dx: 0,
      dy: 0,
      radius: randomRadius(),
      color: randomColor(),
      isWhiteBall: false,
    },
    {
      id: 3,
      x: 550,
      y: 300,
      dx: 0,
      dy: 0,
      radius: randomRadius(),
      color: randomColor(),
      isWhiteBall: false,
    },
    {
      id: 4,
      x: 600,
      y: 350,
      dx: 0,
      dy: 0,
      radius: randomRadius(),
      color: randomColor(),
      isWhiteBall: false,
    },
    {
      id: 5,
      x: 600,
      y: 250,
      dx: 0,
      dy: 0,
      radius: randomRadius(),
      color: randomColor(),
      isWhiteBall: false,
    },
    {
      id: 6,
      x: 600,
      y: 150,
      dx: 0,
      dy: 0,
      radius: randomRadius(),
      color: randomColor(),
      isWhiteBall: false,
    },
  ],
};

export function ballsReducer(
  state = initialState,
  action: PayloadAction<BallInfo[]>
) {
  switch (action.type) {
    case CHANGE_BALL_COLOR:
      return { ...state, ballsInfo: action.payload };
    default:
      return state;
  }
}
