import IllegalArgumentException from './IllegalArgumentException'
import WeightedQuickUnion from './WeightedQuickUnion'

export default class Percolation {
  #grid: boolean[]
  #openSites: number
  #gridSize: number
  #weightedQuickUnion: WeightedQuickUnion
  #top: number
  #bottom: number

  // creates n-by-n grid, with all sites initially blocked
  constructor(n: number) {
    if (n <= 0) throw new IllegalArgumentException()

    this.#openSites = 0
    this.#gridSize = n * n
    this.#grid = new Array(this.#gridSize)
    this.#weightedQuickUnion = new WeightedQuickUnion(this.#gridSize + 2)
    this.#top = this.#gridSize
    this.#bottom = this.#gridSize + 1

    for (let i = 0; i < this.#gridSize; i++) this.#grid[i] = false
  }

  // opens the site (row, col) if it is not open already
  open(row: number, col: number): void {}

  // is the site (row, col) open?
  isOpen(row: number, col: number): boolean {
    throw new Error('Function not implemented')
  }

  // is the site (row, col) full?
  isFull(row: number, col: number): boolean {
    throw new Error('Function not implemented')
  }

  // returns the number of open sites
  numberOfOpenSites(): number {
    throw new Error('Function not implemented')
  }

  // does the system percolate?
  percolates(): boolean {
    throw new Error('Function not implemented')
  }

  // utility functions
  
}
