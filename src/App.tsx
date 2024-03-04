import { useEffect, useState } from 'react'
import WeightedQuickUnion from './WeightedQuickUnion'
import IllegalArgumentException from './IllegalArgumentException'

export default function App() {
  const [num, setNum] = useState<number>(0)
  const [input, setInput] = useState<string>('')

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const num = parseInt(input)
    if (isNaN(num)) {
      setInput('')
      return
    }
    setNum(num)
  }

  return (
    <>
      <div
        className={`grid-wrapper w-[100%] h-[100vh] flex flex-col items-center justify-center`}
      >
        {num === 0 ? (
          <>
            <form onSubmit={handleSubmit}>
              <label htmlFor='grid-size'>Grid Size</label>
              <input
                id='grid-size'
                type='text'
                className='border border-["black"] block px-4 py-1 mb-4'
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <button className='px-4 py-1 bg-cyan-600 rounded-md text-[white]'>
                Start
              </button>
            </form>
          </>
        ) : (
          <Percolation n={num} />
        )}
      </div>
    </>
  )
}

export function Cell({ isOpen, isFull }: CellProps) {
  const style: React.CSSProperties = {
    border: '0.5px solid black',
    backgroundColor: `${
      isOpen ? `${isFull ? 'rgb(127, 196, 239)' : 'white'}` : 'black'
    }`,
  }
  return <div className='cell' style={style} />
}

export function Percolation({ n }: { n: number }) {
  const [weightedQuickUnion, setWeightedQuickUnion] = useState(
    new WeightedQuickUnion(n * n + 2)
  )
  const [coordinates, setCoordinates] = useState<number[][]>(
    generateCoordinates(n)
  )
  const [state, setState] = useState<State>({
    grid: generateArray(n),
    openSites: 0,
    size: n,
    gridSize: n * n,
    top: n * n,
    bottom: n * n + 1,
  })

  useEffect(() => {
    if (percolates()) return
    const interval = setTimeout(() => {
      const index = Math.floor(Math.random() * coordinates.length)
      const [row, col] = coordinates[index]
      setCoordinates((coordinates) => coordinates.filter((e, i) => i !== index))
      open(row, col)
    }, 1)
    return () => clearTimeout(interval)
  }, [state.grid, state.size])

  const gridStyle: React.CSSProperties = {
    width: '90%',
    height: 'auto',
    maxWidth: '600px',
    display: 'grid',
    gridTemplateColumns: `repeat(${state.size}, auto)`,
    gridAutoRows: 'true',
    border: '1px solid black',
    aspectRatio: '1/1',
  }

  function open(row: number, col: number): void {
    validate(row, col)
    if (isOpen(row, col)) return

    const p = coordinatesToIndex(row, col)
    const copy = structuredClone(state)
    copy.grid[p] = true
    copy.openSites++

    // connect to virtual top/bottom if in respective row
    if (row === 1) weightedQuickUnion.union(p, state.top)
    if (row === state.size) weightedQuickUnion.union(p, state.bottom)

    // join adjacent cells
    connect(p, row - 1, col)
    connect(p, row + 1, col)
    connect(p, row, col - 1)
    connect(p, row, col + 1)

    setState(copy)
  }

  function isOpen(row: number, col: number): boolean {
    const p = coordinatesToIndex(row, col)
    return state.grid[p]
  }

  function isFull(row: number, col: number): boolean {
    validate(row, col)
    const p = coordinatesToIndex(row, col)
    return weightedQuickUnion.connected(p, state.top)
  }

  function isIndexFull(p: number) {
    return weightedQuickUnion.connected(p, state.top)
  }

  function numberOfOpenSites(): number {
    return state.openSites
  }

  function percolates(): boolean {
    return weightedQuickUnion.connected(state.top, state.bottom)
  }

  function validate(row: number, col: number): void {
    if (row < 1 || row > state.size) throw new IllegalArgumentException()
    if (col < 1 || col > state.size) throw new IllegalArgumentException()
  }

  function coordinatesToIndex(row: number, col: number) {
    return state.size * (row - 1) + col - 1
  }

  function connect(p: number, row: number, col: number): void {
    try {
      validate(row, col)
      if (!isOpen(row, col)) return

      const q = coordinatesToIndex(row, col)
      if (weightedQuickUnion.find(p) === weightedQuickUnion.find(q)) return

      weightedQuickUnion.union(p, q)
    } catch (e) {
      return
    }
  }

  return (
    <>
      <div id='test' style={gridStyle}>
        {state.grid.map((cell, i) => (
          <Cell key={i} isOpen={cell} isFull={isIndexFull(i)} />
        ))}
      </div>
      <div className='grid grid-cols-2 grid-flow-row gap-x-2'>
        <div>
          <p className='text-center'>open sites</p>
          <div className='separator h-[1px] bg-black'></div>
          <p className='text-center'>total sites</p>
        </div>
        <div>
          <p className='text-center'>{state.openSites}</p>
          <div className='separator h-[1px] bg-black w-1/2 mx-auto' />
          <p className='text-center'>{state.gridSize}</p>
        </div>
      </div>
    </>
  )
}
//className='after:content-["="] after:absolute'
export interface CellProps {
  isOpen: boolean
  isFull: boolean
}

export interface State {
  grid: boolean[]
  openSites: number
  size: number
  gridSize: number
  top: number
  bottom: number
}

function generateNumber(n: number) {
  return Math.floor(Math.random() * n) + 1
}

function generateArray(n: number): boolean[] {
  let array = new Array(n * n)
  for (let i = 0; i < array.length; i++) array[i] = false

  return array
}

function generateCoordinates(n: number): number[][] {
  const arr = []
  for (let i = 1; i <= n; i++) for (let j = 1; j <= n; j++) arr.push([i, j])

  return arr
}
