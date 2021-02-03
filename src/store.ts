export type Square = {
  id: string;
  x: number;
  y: number;
  sideLength: number;
  rotation: number;
  isSelected: boolean;
};

export const initialState: Square[] = [];

// type PayloadAction<P = void> = {
//   payload: P;
//   type: 'create' | 'rotate' | 'select' | 'deselectAll' | 'translate';
// };

type CreateSquaresPayload = {
  numberOfSquares: number;
  sideLength: number;
};

function createSquares(numberOfSquares: number, sideLength: number) {
  const squaresPerRow = Math.round(Math.sqrt(numberOfSquares));
  const distance = sideLength * 1.75;
  const newSquares: Square[] = [];
  for (let n = 1; n <= numberOfSquares; n++) {
    const row = Math.ceil(n / squaresPerRow);
    const colum = n - (row - 1) * squaresPerRow;
    const x = distance * colum;
    const y = distance * row;
    const square: Square = {
      id: n.toString(),
      x,
      y,
      sideLength: sideLength,
      rotation: 0,
      isSelected: false,
    };
    newSquares.push(square);
  }
  return newSquares;
}

type RotateSquaresPayload = {
  numberSpinning: number;
};

function rotateSquares(
  state: Square[],
  { numberSpinning }: RotateSquaresPayload
) {
  return state.map((square, n) => {
    if (n < numberSpinning) {
      square = { ...square, rotation: square.rotation + 1 };
    }
    return square;
  });
}

type SelectSquarePayload = {
  squareId: string;
};

function selectSquare(state: Square[], { squareId }: SelectSquarePayload) {
  return state.map(square => {
    if (square.id === squareId) {
      square = { ...square, isSelected: !square.isSelected };
    }
    return square;
  });
}

function deselectAllSquares(state: Square[]) {
  return state.map(square => {
    square = { ...square, isSelected: false };
    return square;
  });
}

type TranslateSquaresPayload = {
  deltaX: number;
  deltaY: number;
};

function translateSquares(
  state: Square[],
  { deltaX, deltaY }: TranslateSquaresPayload
) {
  return state.map(square => {
    if (square.isSelected === true) {
      square = {
        ...square,
        x: square.x + deltaX,
        y: square.y - deltaY,
      };
    }
    return square;
  });
}

type Payload =
  | undefined
  | CreateSquaresPayload
  | RotateSquaresPayload
  | SelectSquarePayload
  | TranslateSquaresPayload;

type PayloadAction = {
  type: 'create' | 'rotate' | 'select' | 'deselectAll' | 'translate';
  payload: Payload;
};

function squareReducer(state: Square[], action: PayloadAction) {
  switch (action.type) {
    case 'create':
      const payload = action.payload as CreateSquaresPayload;
      return createSquares(payload.numberOfSquares, payload.sideLength);
    case 'rotate':
      return { count: state.count - 1 };
    case 'select':
      return { count: state.count - 1 };
    case 'deselectAll':
      return { count: state.count - 1 };
    case 'translate':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

// translateSelected: (
//   state,
//   action: PayloadAction<{ deltaX: number; deltaY: number }>
// ) => {
//   for (let square of state.squares) {
//     if (square.isSelected) {
//       square.x += action.payload.deltaX;
//       square.y -= action.payload.deltaY;
//     }
//   }
// },
// },
// });
