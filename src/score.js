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

    titleWrapper.append(title)
    wrapper.append(titleWrapper)
    wrapper.append(scoreCounterWrapper)

    scores[`snake-${snakeId}`] = {
      wrapper,
      titleWrapper,
      scoreCounterWrapper,
    }

    scoreBoardList.append(wrapper)
  }

  scores[`snake-${snakeId}`].scoreCounterWrapper.textContent = score
}
