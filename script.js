// eslint-disable-next-line no-unused-vars
const GameBoard = (() => {
  //* VARIABLES *//
  const winningComp = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const board = document.getElementById('board');

  const cells = [...document.querySelectorAll('.board__cell')];

  const scores = {
    playerX: 0,
    playerO: 0,
    draws: 0,
  };

  /* SCORES */

  const xName = document.getElementById('name__playerx').textContent;
  const oName = document.getElementById('name__playero').textContent;

  const xScore = document.getElementById('score__playerx');
  const oScore = document.getElementById('score__playero');
  const drawScore = document.getElementById('score__draws');

  /* GAME END & RESET */
  const gameEndWindow = document.getElementById('game-end');
  const restartButton = document.getElementById('restart-button');

  let currentClass = 'xs';

  //* FUNCTIONS *//
  const addMarker = (cell) => {
    cell.classList.add(currentClass);
  };

  const switchTurn = () => {
    if (currentClass === 'xs') {
      board.classList.remove('x');
      board.classList.add('o');
      currentClass = 'os';
    } else {
      board.classList.remove('o');
      board.classList.add('x');
      currentClass = 'xs';
    }
  };
  // eslint-disable-next-line max-len
  const checkWin = () => winningComp.some((comp) => comp.every((index) => cells[index].classList.contains(currentClass)));

  const checkDraw = () => cells.every((cell) => cell.classList.contains('xs') || cell.classList.contains('os'));

  const updateScore = (result) => {
    if (result === 'xs') {
      scores.playerX += 1;
      xScore.textContent = scores.playerX;
    } else if (result === 'os') {
      scores.playerO += 1;
      oScore.textContent = scores.playerO;
    } else {
      scores.draws += 1;
      drawScore.textContent = scores.draws;
    }
  };

  const resetCells = () => {
    cells.forEach((element) => {
      element.classList.remove('xs');
      element.classList.remove('os');
    });
  };

  const resetEverything = () => {
    gameEndWindow.classList.add('show');
    resetCells();
    currentClass = 'xs';
    board.classList.remove('o');
    board.classList.add('x');
  };

  const gameEnd = (winner) => {
    gameEndWindow.classList.remove('show');
    restartButton.addEventListener('click', () => {
      resetEverything();
    });
    if (winner === 'xs') gameEndWindow.children[0].textContent = `${xName} won!`;
    else if (winner === 'os') gameEndWindow.children[0].textContent = `${oName} won!`;
    else gameEndWindow.children[0].textContent = 'It\'s a draw!';
  };

  const handleClick = () => {
    cells.forEach((element) => {
      element.addEventListener('click', (e) => {
        addMarker(e.target);
        if (checkWin()) {
          updateScore(currentClass);
          gameEnd(currentClass);
        } else if (checkDraw()) {
          updateScore('draw');
          gameEnd();
        }
        switchTurn();
      });
    });
  };

  handleClick(cells);
})();
