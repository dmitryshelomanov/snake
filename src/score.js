const scoreBoardList = document.querySelector('.board-list')

const scores = {}

export function setScore(snakeId, { score, color }) {
  if (!scores[`snake-${snakeId}`]) {
    const wrapper = document.createElement('div')
    const titleWrapper = document.createElement('p')
    const title = document.createTextNode('Score: ')
    const scoreCounterWrapper = document.createElement('p')

    scoreCounterWrapper.setAttribute('id', `snake-${snakeId}`)
    wrapper.classList.add('board')
    wrapper.style.color = color

    titleWrapper.appendChild(title)
    wrapper.appendChild(titleWrapper)
    wrapper.appendChild(scoreCounterWrapper)

    scores[`snake-${snakeId}`] = {
      wrapper,
      titleWrapper,
      scoreCounterWrapper,
    }

    scoreBoardList.appendChild(wrapper)
  }

  scores[`snake-${snakeId}`].scoreCounterWrapper.innerText = score
}
