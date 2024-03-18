import { useRef, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeBallColor } from "../model/boardAC";
import { RootState } from "../../../store/store";
import React from "react";

export interface BallInfo {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  radius: number;
  color: string;
  isWhiteBall: boolean;
}

function Board({
  width = 1000,
  height = 500,
}: {
  width?: number;
  height?: number;
}) {
  const dispatch = useDispatch();
  const boardRef = useRef<HTMLCanvasElement>(null);
  const [isColorMenuOpened, setIsColorMenuOpened] = useState(false);
  const [ballsCurrentInfo, setBallsCurrentInfo] = useState<BallInfo[]>([]);
  const [chosenBallId, setChosenBallId] = useState<number | null>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const state = useSelector((state: RootState) => state);

  useEffect(() => {
    const canvas = boardRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const balls: Ball[] = [];
    const friction = -1;
    const mouse = { x: 0, y: 0 };

    class Ball {
      constructor(
        public id: number,
        public x: number,
        public y: number,
        public dx: number,
        public dy: number,
        public radius: number,
        public color: string,
        public isWhiteBall: boolean
      ) {}

      draw() {
        if (ctx) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          ctx.closePath();
        }
      }

      update() {
        if (canvas) {
          this.x += this.dx;
          this.y += this.dy;

          if (
            this.x + this.radius > canvas.width - 20 ||
            this.x - this.radius < 20
          ) {
            this.dx = -this.dx / 1.5;
          }

          if (
            this.y + this.radius > canvas.height - 20 ||
            this.y - this.radius < 20
          ) {
            this.dy = -this.dy / 1.5;
          }

          this.draw();
        }
      }
    }

    function init() {
      state.balls.ballsInfo.forEach((ball) => {
        balls.push(
          new Ball(
            ball.id,
            ball.x,
            ball.y,
            ball.dx,
            ball.dy,
            ball.radius,
            ball.color,
            ball.isWhiteBall
          )
        );
      });

      setBallsCurrentInfo(balls);
    }

    function animate() {
      if (canvas && ctx) {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        balls.forEach((ball) => {
          ball.update();

          balls.forEach((otherBall) => {
            if (ball !== otherBall) {
              const dx = otherBall.x - ball.x;
              const dy = otherBall.y - ball.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < ball.radius + otherBall.radius) {
                const angle = Math.atan2(dy, dx);
                const targetX =
                  ball.x + Math.cos(angle) * (ball.radius + otherBall.radius);
                const targetY =
                  ball.y + Math.sin(angle) * (ball.radius + otherBall.radius);
                const ax = (targetX - otherBall.x) * 0.1;
                const ay = (targetY - otherBall.y) * 0.1;

                ball.dx -= ax;
                ball.dy -= ay;
                otherBall.dx += ax;
                otherBall.dy += ay;
              }
            }
          });

          if (
            ball.x - ball.radius <= 0 ||
            ball.x + ball.radius >= canvas.width
          ) {
            ball.dx = -ball.dx * friction;
          }

          if (
            ball.y - ball.radius <= 0 ||
            ball.y + ball.radius >= canvas.height
          ) {
            ball.dy = -ball.dy * friction;
          }
        });
      }
    }

    init();
    animate();

    const whiteBall = balls.find((el) => el.isWhiteBall);

    function handleMouseMove(e: { clientX: number; clientY: number }) {
      if (whiteBall && canvas) {
        mouse.x = e.clientX - canvas.getBoundingClientRect().left;
        mouse.y = e.clientY - canvas.getBoundingClientRect().top;

        const dx = whiteBall.x - mouse.x;
        const dy = whiteBall.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < whiteBall?.radius) {
          const angle = Math.atan2(dy, dx);
          whiteBall.dx += Math.cos(angle) * 1;
          whiteBall.dy += Math.sin(angle) * 1;
        }
      }
    }

    if (whiteBall) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }
    function handleClick(e: { clientX: number; clientY: number }) {
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        balls.forEach((ball) => {
          const dx = clickX - ball.x;
          const dy = clickY - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < ball.radius + 15) {
            setIsColorMenuOpened(true);
            setChosenBallId(ball.id);
          }
        });
      }
    }

    canvas.addEventListener("click", handleClick);
    return () => {
      if (whiteBall) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      canvas.removeEventListener("click", handleClick);
    };
  }, [dispatch, state.balls, setIsColorMenuOpened]);

  function onSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();
    const changedBalls = ballsCurrentInfo.map((ball) =>
      ball.id === chosenBallId
        ? { ...ball, color: colorInputRef.current?.value || "" }
        : { ...ball }
    );

    dispatch(changeBallColor(changedBalls));
    setChosenBallId(null);
    setIsColorMenuOpened(false);
  }

  function onCancel() {
    setChosenBallId(null);
    setIsColorMenuOpened(false);
  }

  return (
    <div className="board">
      <header className="board__header">
        <h1 className="board__title">Белый шарик можно толкать курсором</h1>
        <h2 className="board__subtitle">
          Кликни на шарик, чтобы поменять его цвет
        </h2>
      </header>
      <canvas
        className="board__canvas"
        style={{ backgroundColor: "green", border: "20px solid brown" }}
        ref={boardRef}
        width={width}
        height={height}
      ></canvas>
      {isColorMenuOpened && (
        <form className="board__color-form color-form" onSubmit={onSubmit}>
          <label className="color-form__label">Выберите цвет для шара:</label>
          <input
            className="color-form__color-input"
            ref={colorInputRef}
            type="color"
          />
          <div className="color-form__button-section button-section">
            <button className="button-section__color-submit" type="submit">
              Подтвердить
            </button>
            <button className="button-section__color-cancel" onClick={onCancel}>
              Отменить
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Board;
