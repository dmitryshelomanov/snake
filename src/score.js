const scoreBoard = document.querySelector('#score')

export function setScore(score) {
  scoreBoard.textContent = score
}
