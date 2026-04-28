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
  };
};

function playGame() {
  const board = document.querySelector(".board");
  const dialog = document.querySelector("#start-game-dialog");
  const closeButton = document.querySelector("#dialog-close-button");
  const startNew = document.querySelector("#new-game-button");
  const form = document.querySelector("form");
  const nextGame = document.querySelector("#next-round-button");
  var player1Name = "Default Alex";
  var player2Name = "Default June";
  var firstPlayer = "player1";
  let game = gameController();
  let gameOver = false;

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
    player2Name = document.querySelector("#player2-name").value;
    firstPlayer = document.querySelector('input[name="choice"]:checked').value;
    game.addValues(player1Name, player2Name, firstPlayer);
    game.toggleFill("remove");
    game.displayResult("default", "reset");

    game.startGame();
    game.display();
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
      `Loser's Turn: ${game.getCurrentPlayer().name} plays next (${game.getCurrentPlayer().textMarker})`,
    );
    game.displayResult("default");
    if (board.classList.contains("game-over")) {
      board.classList.remove("game-over");
    }
  });

  board.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell") && !gameOver) {
      const [temp, i, j] = event.target.id.split("-");
      const validMove = game.playRound(Number(i), Number(j));

      if (validMove) {
        game.display();
        event.target.classList.remove("highlight");
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
      } else {
        console.log("Invalid move");
      }
    }
  });

  board.addEventListener("mouseover", (event) => {
    if (
      event.target.classList.contains("cell") &&
      !gameOver &&
      !event.target.textContent
    ) {
      event.target.textContent = game.getCurrentPlayer().textMarker;
      event.target.classList.add("highlight");
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
