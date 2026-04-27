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

  const increaseScore = () => {
    score++;
  };
  const sayName = () => {
    console.log(name);
  };

  return {
    name,
    score,
    marker,
    increaseScore,
    sayName,
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
<bold class = "special-text">${currentPlayer.name}\'s</bold> turn
`;
  };

  const playRound = (i, j) => {
    if (gameBoard.board[i][j]) {
      return false;
    } else {
      gameBoard.addMark(i, j, currentPlayer.marker);
      currentPlayer = currentPlayer === player1 ? player2 : player1;
      currentPlayerHeader.innerHTML = `
<bold class = "special-text">${currentPlayer.name}\'s</bold> turn
`;

      return true;
    }
  };

  const displayResult = (result) => {
    scoreBoard.innerHTML = `
<h2>Score Board</h2>
<h3>${player1.name}: ${player1.score} points</h3>
<h3>${player2.name}: ${player2.score} points</h3>
`;

    if (result === "tie") {
      winnerDetails.innerHTML = ` It\'s a <span class="special-text">tie</span>`;
    } else if (result === "default") {
      winnerDetails.innerHTML = `<span class="special-text">No Player</span> has won yet`;
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
      if (rowResult) return rowResult;
      const colResult = checkLine([
        gameBoard.board[0][i],
        gameBoard.board[1][i],
        gameBoard.board[2][i],
      ]);
      if (colResult) return colResult;
    }

    const firstDiagonal = checkLine([
      gameBoard.board[0][0],
      gameBoard.board[1][1],
      gameBoard.board[2][2],
    ]);
    if (firstDiagonal) return firstDiagonal;
    const secondDiagonal = checkLine([
      gameBoard.board[0][2],
      gameBoard.board[1][1],
      gameBoard.board[2][0],
    ]);
    if (secondDiagonal) return secondDiagonal;

    if (gameBoard.board.every((row) => row.every((cell) => cell !== 0))) {
      return "tie";
    }
    return "resume";
  };

  const display = () => {
    gameBoard.displayBoard();
  };

  return {
    startGame,
    playRound,
    displayResult,
    gameBoard,
    checkGameStatus,
    display,
    currentPlayer,
    addValues,
  };
};

function playGame(name1, name2, first) {
  let game = gameController();
  let gameOver = false;
  game.addValues(name1, name2, first);
  game.startGame();
  game.displayResult("default");

  const board = document.querySelector(".board");

  board.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell") && !gameOver) {
      const [temp, i, j] = event.target.id.split("-");
      const validMove = game.playRound(Number(i), Number(j));

      if (validMove) {
        game.display();
        const result = game.checkGameStatus();

        if (result === "resume") {
        } else if (result === "tie") {
          game.displayResult(result);
          gameOver = true;
        } else {
          gameOver = true;
          result.increaseScore();
          game.displayResult(result);
        }
      } else {
        console.log("Invalid move");
      }
    }
  });
}

function mainPlace() {
  const dialog = document.querySelector("#start-game-dialog");
  const closeButton = document.querySelector("#dialog-close-button");
  const submitButton = document.querySelector("#dialog-submit-button");
  const startNew = document.querySelector("#new-game-button");
  const form = document.querySelector("form");
  const nextGame = document.querySelector("#next-round-button");

  startNew.addEventListener("click", () => {
    form.reset();
    dialog.showModal();
  });

  closeButton.addEventListener("click", () => {
    form.reset();
    dialog.close();
  });
  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    const player1Name = document.querySelector("#player1-name");
    const player2Name = document.querySelector("#player2-name");
    const firstPlayer = document.querySelector('input[name="choice"]:checked');
    playGame(player1Name.value, player2Name.value, firstPlayer.value);
    dialog.close();
  });

  nextGame.addEventListener("click", () => {
    playGame();
  });
}

mainPlace();
