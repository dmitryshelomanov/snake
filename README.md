# Snake Game 🤯

[Try it 👻](https://dmitryshelomanov.github.io/snake/)

[Stress test](https://dmitryshelomanov.github.io/snake/?cellSize=10&fps=60&isVisibleBoard=false&snakeCount=40)

![preview](preview.gif)

## New Feature 🥳!

- Added own to game
- Added differents alghorithms
- Added Code editor for custom user algorimth
- Snakes have become very tenacious (without algorithm)
- Config from URL params

## Introduction

Simple snake game with bot wich looking for shorter path to target

Your opportunities

- Toggle different settings
- Add self to game
- Add bricks to arbitrary place
- Use different search algorighms

Feature

- change FPS
- algorithm visualization

Notes

_Use keyword [/_ Note:](https://github.com/dmitryshelomanov/snake/search?q=%2F*+Note%3A&unscoped_q=%2F*+Note%3A) if you want to read algorigthm details\*

## URL Params

- <b>cellSize</b>: number = 50 - Cell with/height
- <b>pageWidth/pageHeight</b>: number = window size - Canvas size
- <b>fps</b>: number = 15 - frame tick
- <b>borderSize</b>: number = 1 - cell border size
- <b>foodCount</b>: number = 50 - food count
- <b>snakeCount</b>: number = 1 - snake count
- <b>isVisibleBoard</b>: boolean = true - board visbile state

## Perfomance warning

Visualization is not designed for a large number of objects

I can add deep lvl for alghoritms and this will increase productivity but I can't optimize react renders, but can controll visible state for board

### Data information

- Without sidebar

Snakes count - 100
Foos count - 100

renderLoop completed for 0.40ms and logicLoop - for 5ms

- With sidebar

Snakes count - 100
Foos count - 100

renderLoop completed for 0.40ms, logicLoop - for 40ms and react took 300-400 ms
