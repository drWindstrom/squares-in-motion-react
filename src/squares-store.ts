import { Square } from "./types/types";

export const initialSquares: Square[] = [];

export type ActionType = 
  | { type: "SET"; squares: Square[] }
  | { type: "ROTATE"; spinningNumber: number }
  | { type: "TOGGLE_HIGHLIGHT"; changed: Square }
  | { type: "TOGGLE_SELECT"; changed: Square }
  | { type: "DESELECT_ALL" }
  | { type: "TRANSLATE_SELECTED_SQUARES"; delta: {x: number, y: number} }

export function squaresReducer(squares: Square[], action: ActionType) {
  switch (action.type) {
    case "SET": {
      return action.squares;
    }

    case "ROTATE": {
      const nextSquares = squares.map((square, n) => {
        if (n < action.spinningNumber) {
          square = { ...square, rotation: square.rotation + 1 };
        }
        return square;
      });
      return nextSquares;
    }

    case "TOGGLE_HIGHLIGHT": {
      const nextSquares = squares.map((square) => {
        if (square === action.changed) {
          square = { ...square, isHighligted: !square.isHighligted };
        }
        return square;
      });
      return nextSquares;
    }

    case "TOGGLE_SELECT": {
      const nextSquares = squares.map((square) => {
        if (square === action.changed) {
          square = { ...square, isSelected: !square.isSelected };
        }
        return square;
      });
      return nextSquares;
    }

    case "DESELECT_ALL": {
      const nextSquares = squares.map((square) => {
        return { ...square, isSelected: false };
      });
      return nextSquares;
    }

    case "TRANSLATE_SELECTED_SQUARES": {
      const nextSquares = squares.map((square) => {
        if (square.isSelected) {
          square = {
            ...square,
            x: square.x + action.delta.x,
            y: square.y - action.delta.y,
          };
        }
        return square;
      });
      return nextSquares;
    }

    default:
      throw new Error();
  }
}

// Action creators
export function setSquares(squares: Square[]): ActionType {
  return {
    type: "SET",
    squares: squares,
  };
}

export function rotateSquares(spinningNumber: number): ActionType {
  return {
    type: "ROTATE",
    spinningNumber: spinningNumber,
  };
}

export function toggleHighlightSquare(square: Square): ActionType {
  return {
    type: "TOGGLE_HIGHLIGHT",
    changed: square,
  };
}

export function toggleSelectSquare(square: Square): ActionType {
  return {
    type: "TOGGLE_SELECT",
    changed: square,
  };
}

export function deselectAllSquares(): ActionType {
  return {
    type: "DESELECT_ALL",
  };
}

export function translateSelectedSquares(delta: {x: number, y: number}): ActionType {
  return {
    type: "TRANSLATE_SELECTED_SQUARES",
    delta: delta,
  };
}