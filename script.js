/* eslint-disable max-len */
const GameSettings = (() => {
  //* VARIABLES *//
  const humanPlayer = 'X';
  const aiPlayer = 'O';
  let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const score = {
    x: 0,
    o: 0,
    draws: 0,
  };

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let currentPlayer = humanPlayer;

  //* DOM ELEMENTS *//

  const boardDiv = document.getElementById('board');

  const startWindow = document.getElementById('start-window');
  const startAiGame = document.getElementById('start-aigame');
  const start2pGame = document.getElementById('start-2pgame');
  const playerXName = document.getElementById('playerxname');
  const playerOName = document.getElementById('playeroname');
  const scoreX = document.getElementById('score-x');
  const scoreO = document.getElementById('score-o');
  const scoreDraws = document.getElementById('score-draws');

  const namesWindow = document.getElementById('names-window');
  const namesInputX = document.getElementById('x-input');
  const namesInputO = document.getElementById('o-input');
  const namesButton = document.getElementById('names-button');
  const errorNames = document.querySelector('.error-form');

  const gameEndWindow = document.getElementById('game-end');
  const gameEndTitle = document.getElementById('game-end-title');
  const resetButton = document.getElementById('restart-button');

  const subtitle = document.getElementById('subtitle');
  const cells = [...document.querySelectorAll('.board__cell')];

  //* FUNCTIONS *//
  const addClass = (target) => {
    if (currentPlayer === humanPlayer) target.classList.add('xs');
    else target.classList.add('os');
  };

  const updateMoves = (target) => {
    board[target.dataset.index] = currentPlayer;
  };

  const cleanBoard = (boardArray) => boardArray.filter((index) => index !== 'X' && index !== 'O');

  const setScores = () => {
    scoreX.textContent = score.x;
    scoreO.textContent = score.o;
    scoreDraws.textContent = score.draws;
  };

  const updateScore = (player) => {
    switch (player) {
      case 'X':
        scoreX.textContent = score.x;
        break;
      case 'O':
        scoreO.textContent = score.o;
        break;
      case 'draw':
        scoreDraws.textContent = score.draws;
        break;
      default:
        break;
    }
  };

  const resetCells = () => {
    cells.forEach((element) => {
      element.classList.remove('xs');
      element.classList.remove('os');
    });
  };

  const resetEverything = () => {
    gameEndWindow.classList.add('dontshow');
    resetCells();
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    currentPlayer = humanPlayer;
    boardDiv.classList.remove('o');
    boardDiv.classList.add('x');
  };

  const gameEnd = (winner) => {
    gameEndWindow.classList.remove('dontshow');
    if (winner === 'X') {
      score.x += 1;
      gameEndTitle.textContent = `${playerXName.textContent} wins!`;
      updateScore(winner);
    } else if (winner === 'O') {
      score.o += 1;
      gameEndTitle.textContent = `${playerOName.textContent} wins!`;
      updateScore(winner);
    } else {
      score.draws += 1;
      gameEndTitle.textContent = 'It\'s a draw!';
      updateScore('draw');
    }
  };

  const checkWin = (boardArray, player) => winningCombinations.some((combination) => combination.every((cell) => boardArray[cell] === player));

  const checkDraw = () => {
    if (cleanBoard(board).length === 0 && checkWin(board, currentPlayer) === false) return gameEnd();
    return false;
  };

  const switchPlayer = () => {
    if (currentPlayer === humanPlayer) currentPlayer = aiPlayer;
    else currentPlayer = humanPlayer;
  };

  const switchBoardHover = () => {
    if (currentPlayer === humanPlayer) {
      boardDiv.classList.remove('o');
      boardDiv.classList.add('x');
    } else {
      boardDiv.classList.remove('x');
      boardDiv.classList.add('o');
    }
  };

  const minimax = (newBoard, player) => {
    const possibleMoves = cleanBoard(board);
    // Checks if the game ends with a win, lose or tie
    if (checkWin(newBoard, humanPlayer)) return { score: -10 };
    if (checkWin(newBoard, aiPlayer)) return { score: 10 };
    if (possibleMoves.length === 0) return { score: 0 };
    // Array to store all objects
    const moves = [];
    for (let i = 0; i < possibleMoves.length; i += 1) {
      // Creates an object for each move and stores the index of that spot
      const move = {};
      move.index = newBoard[possibleMoves[i]];
      // eslint-disable-next-line no-param-reassign
      newBoard[possibleMoves[i]] = player;

      if (player === aiPlayer) {
        const result = minimax(newBoard, humanPlayer);
        move.score = result.score;
      } else {
        const result = minimax(newBoard, aiPlayer);
        move.score = result.score;
      }
      // reset spot to empty
      // eslint-disable-next-line no-param-reassign
      newBoard[possibleMoves[i]] = move.index;

      // push the object to the array
      moves.push(move);
    }
    // if it is the computer's turn loop over the moves and choose the move with the highest score
    let bestMove;
    if (player === aiPlayer) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i += 1) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      // else loop over the moves and choose the move with the lowest score
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i += 1) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }
    // return the chosen move (object) from the moves array
    return moves[bestMove];
  };

  const iaMove = (move) => {
    addClass(cells[move]);
    updateMoves(cells[move]);
    if (checkWin(board, currentPlayer)) gameEnd(currentPlayer);
    checkDraw();
    switchPlayer();
  };

  const gameVsAi = () => {
    setScores();
    cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        if (board[e.target.dataset.index] === 'X' || board[e.target.dataset.index] === 'O') return;
        addClass(e.target);
        updateMoves(e.target);
        if (checkWin(board, currentPlayer)) gameEnd(currentPlayer);
        checkDraw();
        switchPlayer();
        iaMove(minimax(board, aiPlayer).index); // AI makes his move
      });
    });
  };

  const gameWithTwoPlayers = () => {
    setScores();
    subtitle.textContent = 'Place three of marks in a horizontal, vertical, or diagonal row to win!';
    playerXName.textContent = namesInputX.value;
    playerOName.textContent = namesInputO.value;
    cells.forEach((cell) => {
      cell.addEventListener('click', (e) => {
        if (board[e.target.dataset.index] === 'X' || board[e.target.dataset.index] === 'O') return;
        addClass(e.target);
        updateMoves(e.target);
        if (checkWin(board, currentPlayer)) gameEnd(currentPlayer);
        checkDraw();
        switchPlayer();
        switchBoardHover();
      });
    });
  };

  const startNewGame = () => {
    startAiGame.addEventListener('click', () => {
      startWindow.classList.add('dontshow');
      gameVsAi();
    });
    start2pGame.addEventListener('click', () => {
      startWindow.classList.add('dontshow');
      namesWindow.classList.remove('dontshow');
    });
    namesButton.addEventListener('click', () => {
      if (namesInputX.value === '' || namesInputO.value === '') {
        errorNames.classList.remove('dontshow');
      } else {
        namesWindow.classList.add('dontshow');
        gameWithTwoPlayers();
      }
    });
    resetButton.addEventListener('click', () => {
      gameEndWindow.classList.add('dontshow');
      resetEverything();
    });
  };

  return { startNewGame };
})();
GameSettings.startNewGame();
