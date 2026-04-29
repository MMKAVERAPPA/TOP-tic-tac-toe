function createGameBoard() {
  const board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];

  const displayBoard = () => {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const cell = document.getElementById(`cell-${i}-${j}`);
        if (board[i][j] === 1) {
          cell.textContent = "X";
        } else if (board[i][j] === 2) {
          cell.textContent = "O";
        } else {
          cell.textContent = "";
        }
      }
    }
  };

  const addMark = (i, j, marker) => {
    board[i][j] = marker;
  };

  return {
    board,
    displayBoard,
    addMark,
  };
}

function createPlayer(name, marker) {
  let score = 0;
  let textMarker;
  if (marker === 1) {
    textMarker = "X";
  } else {
    textMarker = "O";
  }

  const increaseScore = () => {
    score++;
  };

  const getScore = () => {
    return score;
  };

  return {
    name,
    getScore,
    marker,
    increaseScore,
    textMarker,
  };
}

const gameController = () => {
  const currentPlayerHeader = document.querySelector("#current-player-header");
  const scoreBoard = document.querySelector(".content-right-side-bar");
  const winnerDetails = document.querySelector(".winner-details");
  let gameBoard = createGameBoard();
  let player1;
  let player2;
  let currentPlayer;

  const startGame = () => {
    if (gameBoard) {
      gameBoard = createGameBoard();
    }
  };

  const addValues = (name1, name2, first) => {
    player1 = createPlayer(name1, 1);
    player2 = createPlayer(name2, 2);
    if (first === "player1") {
      currentPlayer = player1;
    } else {
      currentPlayer = player2;
    }

    currentPlayerHeader.innerHTML = `
<bold class = "special-text">${currentPlayer.name}\'s</bold> turn (${currentPlayer.textMarker})
`;
  };

  const playRound = (i, j) => {
    if (gameBoard.board[i][j]) {
      return false;
    } else {
      gameBoard.addMark(i, j, currentPlayer.marker);
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      currentPlayerHeader.innerHTML = `
<bold class = "special-text">${currentPlayer.name}\'s</bold> turn (${currentPlayer.textMarker})
`;

      return true;
    }
  };

  const displayResult = (result, reset = "none") => {
    if (result !== "default" || reset !== "none") {
      scoreBoard.innerHTML = `
    <h2>Score Board</h2>
    <h3>${player1.name}: ${player1.getScore()} points</h3>
    <h3>${player2.name}: ${player2.getScore()} points</h3>
    `;
    }

    if (result === "tie") {
      winnerDetails.innerHTML = ` It\'s a <span class="special-text">tie</span>`;
    } else if (result === "default") {
      winnerDetails.innerHTML = `<span class="special-text">Play</span> the Round`;
    } else {
      winnerDetails.innerHTML = `<span class="special-text">${result.name}</span> won`;
    }
  };

  const checkLine = (line) => {
    if (line.every((x) => x === 1)) {
      return player1;
    } else if (line.every((x) => x === 2)) {
      return player2;
    }
    return false;
  };
  const checkGameStatus = () => {
    for (let i = 0; i < 3; i++) {
      const rowResult = checkLine(gameBoard.board[i]);
      if (rowResult)
        return [
          rowResult,
          [
            [i, 0],
            [i, 1],
            [i, 2],
          ],
        ];
      const colResult = checkLine([
        gameBoard.board[0][i],
        gameBoard.board[1][i],
        gameBoard.board[2][i],
      ]);
      if (colResult)
        return [
          colResult,
          [
            [0, i],
            [1, i],
            [2, i],
          ],
        ];
    }

    const firstDiagonal = checkLine([
      gameBoard.board[0][0],
      gameBoard.board[1][1],
      gameBoard.board[2][2],
    ]);
    if (firstDiagonal)
      return [
        firstDiagonal,
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      ];
    const secondDiagonal = checkLine([
      gameBoard.board[0][2],
      gameBoard.board[1][1],
      gameBoard.board[2][0],
    ]);
    if (secondDiagonal)
      return [
        secondDiagonal,
        [
          [0, 2],
          [1, 1],
          [2, 0],
        ],
      ];

    if (gameBoard.board.every((row) => row.every((cell) => cell !== 0))) {
      return ["tie", "none"];
    }
    return ["resume", "none"];
  };

  const display = () => {
    gameBoard.displayBoard();
  };

  const toggleFill = (indexes, value) => {
    if (value === "fill") {
      for (let i = 0; i < 3; i++) {
        var index = indexes[i];
        const cell = document.getElementById(`cell-${index[0]}-${index[1]}`);
        cell.classList.toggle("filled");
      }
    } else {
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const cell = document.getElementById(`cell-${i}-${j}`);
          if (cell.classList.contains("filled")) {
            cell.classList.remove("filled");
          }
        }
      }
    }
  };

  const changeTurnText = (text) => {
    currentPlayerHeader.innerHTML = `
<bold class = "special-text">${text}</bold>
`;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  const getGameBoard = () => {
    return gameBoard;
  };

  return {
    startGame,
    playRound,
    displayResult,
    gameBoard,
    checkGameStatus,
    display,
    getCurrentPlayer,
    addValues,
    toggleFill,
    changeTurnText,
    getGameBoard,
  };
};

const createAI = () => {
  const calculateScore = (path) => {
    let aiCount = 0;
    let opponentCount = 0;

    for (let i = 0; i < 3; i++) {
      if (path[i] === 2) {
        aiCount++;
      } else if (path[i] === 1) {
        opponentCount++;
      }
    }

    if (aiCount === 2 && opponentCount === 0) return 1000;
    if (opponentCount === 2 && aiCount === 0) return 900;
    if (aiCount === 1 && opponentCount === 1) return 0;
    if (aiCount === 1 && opponentCount === 0) return 50;
    if (aiCount === 0 && opponentCount === 1) return 40;
    return 10;
  };

  const checkIfValid = (path, mode = "path") => {
    if (mode == "path") {
      if (path.every((i) => i === 1 || i === 2)) {
        return false;
      } else {
        return true;
      }
    }
  };

  const getScores = (gameBoard) => {
    var paths = [];

    for (let i = 0; i < 3; i++) {
      if (checkIfValid(gameBoard.board[i])) {
        const rowResult = calculateScore(gameBoard.board[i]);
        paths.push([
          rowResult,
          [
            [i, 0],
            [i, 1],
            [i, 2],
          ],
        ]);
      }
      const colPath = [
        gameBoard.board[0][i],
        gameBoard.board[1][i],
        gameBoard.board[2][i],
      ];
      if (checkIfValid(colPath)) {
        const colResult = calculateScore(colPath);
        paths.push([
          colResult,
          [
            [0, i],
            [1, i],
            [2, i],
          ],
        ]);
      }
    }

    const firstDiagonalPath = [
      gameBoard.board[0][0],
      gameBoard.board[1][1],
      gameBoard.board[2][2],
    ];
    if (checkIfValid(firstDiagonalPath)) {
      const firstDiagonal = calculateScore(firstDiagonalPath);
      paths.push([
        firstDiagonal,
        [
          [0, 0],
          [1, 1],
          [2, 2],
        ],
      ]);
    }

    const secondDiagonalPath = [
      gameBoard.board[0][2],
      gameBoard.board[1][1],
      gameBoard.board[2][0],
    ];
    if (checkIfValid(secondDiagonalPath)) {
      const secondDiagonal = calculateScore(secondDiagonalPath);
      paths.push([
        secondDiagonal,
        [
          [0, 2],
          [1, 1],
          [2, 0],
        ],
      ]);
    }
    return paths;
  };

  const isBoardEmpty = (gameBoard) => {
    return gameBoard.board.every((row) => row.every((cell) => cell === 0));
  };

  const getBestMove = (gameBoard) => {
    if (isBoardEmpty(gameBoard)) {
      let indices = [
        [0, 0],
        [0, 1],
        [0, 2],
        [1, 0],
        [1, 1],
        [1, 2],
        [2, 0],
        [2, 1],
        [2, 2],
      ];
      return indices[Math.round(Math.random() * 9)];
    }
    var paths = getScores(gameBoard);
    const maxScore = Math.max(...paths.map((p) => p[0]));
    const bestPaths = paths.filter((p) => p[0] === maxScore);

    for (let [score, indexes] of bestPaths) {
      for (let i = 0; i < 3; i++) {
        let index = indexes[i];
        if (gameBoard.board[index[0]][index[1]] === 0) {
          return index;
        }
      }
    }
  };

  return {
    getBestMove,
  };
};

function playGame() {
  const board = document.querySelector(".board");
  const dialog = document.querySelector("#start-game-dialog");
  const closeButton = document.querySelector("#dialog-close-button");
  const startNew = document.querySelector("#new-game-button");
  const form = document.querySelector("form");
  const nextGame = document.querySelector("#next-round-button");
  const gameMode = document.querySelector("#game-mode");
  var player1Name = "Default Alex";
  var player2Name = "Default June";
  var firstPlayer = "player1";
  let game = gameController();
  let gameOver = false;
  let isAIGame = false;
  let ai;

  if (!board.classList.contains("game-over")) {
    board.classList.add("game-over");
  }

  nextGame.disabled = true;
  startNew.addEventListener("click", () => {
    form.reset();
    dialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    form.reset();
    dialog.close();
  });
  form.addEventListener("submit", (event) => {
    gameOver = false;
    event.preventDefault();
    player1Name = document.querySelector("#player1-name").value;

    player2Name = isAIGame
      ? "Computer"
      : document.querySelector("#player2-name").value;
    firstPlayer = document.querySelector('input[name="choice"]:checked').value;
    game.addValues(player1Name, player2Name, firstPlayer);
    game.toggleFill("remove");
    game.displayResult("default", "reset");

    game.startGame();
    game.display();
    if (isAIGame) {
      ai = createAI(game.gameBoard);
    }

    if (isAIGame && game.getCurrentPlayer().marker == 2) {
      setTimeout(() => {
        performAIMove();
      }, 500);
    }

    nextGame.disabled = false;
    dialog.close();
    if (board.classList.contains("game-over")) {
      board.classList.remove("game-over");
    }
  });

  nextGame.addEventListener("click", () => {
    gameOver = false;
    game.toggleFill("remove");
    game.startGame();
    game.display();
    game.changeTurnText(
      `Next Turn: ${game.getCurrentPlayer().name} plays next (${game.getCurrentPlayer().textMarker})`,
    );
    game.displayResult("default");
    if (board.classList.contains("game-over")) {
      board.classList.remove("game-over");
    }

    if (isAIGame && game.getCurrentPlayer().marker == 2) {
      setTimeout(() => {
        performAIMove();
      }, 500);
    }
  });

  gameMode.addEventListener("click", (event) => {
    var player2 = document.querySelector("#player2-name");
    if (event.target.value == "player") {
      isAIGame = true;
      gameMode.textContent = "Player vs Computer";
      event.target.value = "computer";

      player2.disabled = true;
      player2.value = "Computer";
      player2.placeholder = "Computer";
    } else {
      isAIGame = false;
      gameMode.textContent = "Player vs Player";
      event.target.value = "player";
      player2.disabled = false;
      player2.value = player2.defaultValue;
      player2.placeholder = "";
    }
  });

  function handleMoveResult(target) {
    game.display();
    if (target) {
      target.classList.remove("highlight");
    }
    const [result, indexes] = game.checkGameStatus();

    if (result === "resume") {
    } else if (result === "tie") {
      game.displayResult(result);
      gameOver = true;
      game.changeTurnText("Game Over");
      if (!board.classList.contains("game-over")) {
        board.classList.add("game-over");
      }
    } else {
      gameOver = true;
      result.increaseScore();
      game.displayResult(result);
      game.toggleFill(indexes, "fill");
      game.changeTurnText("Game Over");
      if (!board.classList.contains("game-over")) {
        board.classList.add("game-over");
      }
    }
  }
  function performAIMove() {
    if (!gameOver && isAIGame) {
      const [i, j] = ai.getBestMove(game.getGameBoard());
      game.playRound(i, j);
      handleMoveResult();
    }
  }

  board.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell") && !gameOver) {
      if (isAIGame && game.getCurrentPlayer().marker == 2) {
        return;
      }
      const [temp, i, j] = event.target.id.split("-");
      const validMove = game.playRound(Number(i), Number(j));

      if (validMove) {
        handleMoveResult(event.target);
        setTimeout(() => {
          performAIMove();
        }, 500);
      } else {
        console.log("Invalid move");
      }
    }
  });

  function getCellCoordinates(cellId) {
    const [temp, i, j] = cellId.split("-");
    return [Number(i), Number(j)];
  }

  board.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("cell") && !gameOver) {
      const [i, j] = getCellCoordinates(event.target.id);
      if (game.getGameBoard().board[i][j] === 0) {
        event.target.textContent = game.getCurrentPlayer().textMarker;
        event.target.classList.add("highlight");
      }
    }
  });

  board.addEventListener("mouseout", (event) => {
    if (
      event.target.classList.contains("cell") &&
      !gameOver &&
      event.target.classList.contains("highlight")
    ) {
      event.target.textContent = "";
      event.target.classList.remove("highlight");
    }
  });
}

playGame();
