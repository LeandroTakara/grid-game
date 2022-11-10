// DOM elements
const root = document.querySelector(':root')
const inputWidth = document.getElementById('inputWidth')
const inputHeight = document.getElementById('inputHeight')
const buttonNewGame = document.getElementById('btnStart')
const buttonUndo = document.getElementById('btnUndo')
const divGame = document.querySelector('.game')
const divVictory = document.querySelector('.victory-screen')

// game variables
const MAX_GRID_SIZE = 9
const MIN_GRID_SIZE = 2
const MAX_UNDO = 100
let gameFinished = false
let game = []
let gameMoves = []
let width = 3
let height = 3
let clicks = 0
let time = 0
let intervalCounting = null

// events
inputWidth.addEventListener('input', () => changeGridSize('width'))
inputHeight.addEventListener('input', () => changeGridSize('height'))
buttonNewGame.addEventListener('click', newGame)
buttonUndo.addEventListener('click', undoClick)

// game functions
function newGame() {
  resetGame()
  createGrid()
}

function createGrid() {
  for (let row = 0; row < width; row++) {
    const gameRow = []
    for (let column = 0; column < height; column++) {
      const tile = document.createElement('div')
      tile.classList.add('tile')
      tile.addEventListener('click', () => clickTile(row, column))

      divGame.appendChild(tile)
      gameRow.push(tile)
    }
    game.push(gameRow)
  }
}

function clickTile(row, column) {
  changeTile(row, column)

  checkVictory()

  clicks++
  gameMoves.push({ row, column })
  if (gameMoves.length > MAX_UNDO) gameMoves.shift()
  if (!time) startCounting()
}

function changeTile(row, column) {
  // center tile
  transformTile(row, column)
  // up tile
  transformTile(row, column - 1)
  // down tile
  transformTile(row, column + 1)
  // left tile
  transformTile(row - 1, column)
  // right tile
  transformTile(row + 1, column)
}

function undoClick() {
  if (!gameFinished) {
    const coord = gameMoves.pop()
    if (coord) changeTile(coord.row, coord.column)
  }
}

const isInRange = (value, min, max) => value >= min && value <= max
function transformTile(row, column) {
  if (
    isInRange(row, 0, width - 1) &&
    isInRange(column, 0, height - 1)
  ) 
    game[row][column].classList.toggle('clicked')
}

function checkVictory() {
  if (game.flat().every(tile => tile.classList.contains('clicked'))) {
    gameFinished = true
    clearInterval(intervalCounting)

    divVictory.classList.remove('hidden')
    divVictory.innerHTML = `
      <div class="victory-container">
        <div class="msg">YOU WIN</div>
        <div class="game-results">
          <div>Clicks: ${clicks}</div>
          <div>Time: ${parseInt(time / 10)}.${time % 100}s</div>
        </div>
      </div>
    `
  }
}

function getInputValue(input) {
  let value = parseInt(input.value)

  if (value < MIN_GRID_SIZE) {
    input.value = MIN_GRID_SIZE
    value = MIN_GRID_SIZE
  } else if (value > MAX_GRID_SIZE) {
    input.value = MAX_GRID_SIZE
    value = MAX_GRID_SIZE
  }

  return value
}

function changeGridSize(type) {
  if (type === 'width') {
    width = getInputValue(inputWidth)
    root.style.setProperty('--width', width)
  } else if (type === 'height') {
    height = getInputValue(inputHeight)
    root.style.setProperty('--height', height)
  }

  newGame()
}

function resetGame() {
  divGame.innerHTML = ''
  divVictory.innerHTML = ''
  divVictory.classList.add('hidden')
  gameFinished = false
  game = []
  gameMoves = []
  clicks = 0
  time = 0
}

function startCounting() {
  intervalCounting = setInterval(() => {
    time++
  }, 100)
}

newGame()
