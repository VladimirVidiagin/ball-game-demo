import { CHANGE_BALL_COLOR } from "./boardAT";
import { BallInfo } from "../ui/Board"; // Предположим, что у вас есть файл с определениями типов

export const changeBallColor = (
  payload: BallInfo[]
): { type: string; payload: BallInfo[] } => {
  return {
    type: CHANGE_BALL_COLOR,
    payload,
  };
};
