"use client";

import { useState, useEffect, useRef } from "react";
import "./globals.css";

const CELL_SIZE = 20;
const WIDTH = 400;
const HEIGHT = 400;
const DIRECTIONS = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

interface Cell {
  x: number;
  y: number;
}

const getRandomFood = (): Cell => {
  return {
    x: Math.floor(Math.random() * WIDTH / CELL_SIZE),
    y: Math.floor(Math.random() * HEIGHT / CELL_SIZE),
  };
};

const Home = () => {
  const [snake, setSnake] = useState<Cell[]>([{ x: 2, y: 2 }]);
  const [food, setFood] = useState<Cell>(getRandomFood());
  const [direction, setDirection] = useState<string>("ArrowRight");
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const gameBoardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (DIRECTIONS[e.key]) {
        setDirection(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const newSnake = [...prevSnake];
        const head = newSnake[0];
        const newHead = {
          x: head.x + DIRECTIONS[direction].x,
          y: head.y + DIRECTIONS[direction].y,
        };

        if (
          newHead.x < 0 ||
          newHead.x >= WIDTH / CELL_SIZE ||
          newHead.y < 0 ||
          newHead.y >= HEIGHT / CELL_SIZE ||
          newSnake.some((cell) => cell.x === newHead.x && cell.y === newHead.y)
        ) {
          setGameOver(true);
          return prevSnake;
        }

        newSnake.unshift(newHead);

        if (newHead.x === food.x && newHead.y === food.y) {
          setFood(getRandomFood());
          setScore((prevScore) => prevScore + 1);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const interval = setInterval(moveSnake, 200);
    return () => clearInterval(interval);
  }, [direction, food, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div
        ref={gameBoardRef}
        className="relative bg-white"
        style={{
          width: WIDTH,
          height: HEIGHT,
          border: "1px solid black",
        }}
      >
        {snake.map((cell, index) => (
          <div
            key={index}
            className="absolute bg-green-500"
            style={{
              width: CELL_SIZE,
              height: CELL_SIZE,
              left: cell.x * CELL_SIZE,
              top: cell.y * CELL_SIZE,
            }}
          />
        ))}
        <div
          className="absolute bg-red-500"
          style={{
            width: CELL_SIZE,
            height: CELL_SIZE,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE,
          }}
        />
      </div>
      <div className="mt-4">
        <p className="text-xl">Score: {score}</p>
        {gameOver && <p className="text-red-500">Game Over!</p>}
      </div>
    </div>
  );
};

export default Home;