// DOM elements
const root = document.querySelector(':root')
const inputGridSize = document.getElementById('inputGridSize')
const buttonNewGame = document.getElementById('btnStart')
const divGame = document.querySelector('.game')
const divVictory = document.querySelector('.victory-screen')

// game variables
let game = []
let gridSize = 3
let clicks = 0
let time = 0
let intervalCounting

// events
inputGridSize.addEventListener('input', changeGridSize)
buttonNewGame.addEventListener('click', () => {
  resetGame()
  createGrid(gridSize)
})

// game functions
function createGrid(size) {
  // reset
  resetGame()

  for (let row = 0; row < size; row++) {
    const gameRow = []
    for (let column = 0; column < size; column++) {
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

  // check victory
  checkVictory()

  clicks++
  if (!time) startCounting()
}

function transformTile(row, column) {
  if (row >= 0 && row < gridSize && column >= 0 && column < gridSize) game[row][column].classList.toggle('clicked')
}

function checkVictory() {
  if (document.querySelectorAll('.tile.clicked').length === gridSize ** 2) {
    clearInterval(intervalCounting)

    divVictory.classList.remove('hidden')
    divVictory.innerHTML = `
      <div class="victory-container">
        <div class="msg">YOU WIN</div>
        <div class="game-results">
          <div>Clicks: ${clicks}</div>
          <div>Time: ${parseInt(time / 10)}.${time % 10}s</div>
        </div>
      </div>
    `
  }
}

function changeGridSize() {
  gridSize = parseInt(inputGridSize.value)

  root.style.setProperty('--size', gridSize)
  createGrid(gridSize)
}

function resetGame() {
  divGame.innerHTML = ''
  divVictory.innerHTML = ''
  divVictory.classList.add('hidden')
  game = []
  clicks = 0
  time = 0
}

function startCounting() {
  intervalCounting = setInterval(() => {
    time++
  }, 100)
}

createGrid(gridSize)
