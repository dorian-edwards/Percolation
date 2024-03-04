import IllegalArgumentException from './IllegalArgumentException'
import WeightedQuickUnion from './WeightedQuickUnion'

export default class Percolation {
  #grid: boolean[]
  #openSites: number
  #gridSize: number
  #weightedQuickUnion: WeightedQuickUnion
  #top: number
  #bottom: number
  #size: number

  // creates n-by-n grid, with all sites initially blocked
  constructor(n: number) {
    if (n <= 0) throw new IllegalArgumentException()

    this.#openSites = 0
    this.#gridSize = n * n
    this.#grid = new Array(this.#gridSize)
    this.#weightedQuickUnion = new WeightedQuickUnion(this.#gridSize + 2)
    this.#top = this.#gridSize
    this.#bottom = this.#gridSize + 1
    this.#size = n

    for (let i = 0; i < this.#gridSize; i++) this.#grid[i] = false
  }

  get grid() {
    return this.#grid
  }

  // opens the site (row, col) if it is not open already
  open(row: number, col: number): void {
    this.validate(row, col)
    const p = this.coordinatesToIndex(row, col)
    if (this.#grid[p]) return

    this.#grid[p] = true
    this.#openSites++

    if (row === 1) this.#weightedQuickUnion.union(this.#top, p)
    if (row === this.#size) this.#weightedQuickUnion.union(this.#bottom, p)

    this.connect(p, row - 1, col)
    this.connect(p, row + 1, col)
    this.connect(p, row, col - 1)
    this.connect(p, row, col + 1)
  }

  // is the site (row, col) open?
  isOpen(row: number, col: number): boolean {
    this.validate(row, col)
    const i = this.coordinatesToIndex(row, col)
    return this.#grid[i]
  }

  // is the site (row, col) full?
  isFull(row: number, col: number): boolean {
    this.validate(row, col)
    const p = this.coordinatesToIndex(row, col)
    return this.#weightedQuickUnion.connected(p, this.#top)
  }

  isIndexFull(i: number): boolean {
    if (i < 0 || i > this.#gridSize - 1) throw new IllegalArgumentException()
    return this.#weightedQuickUnion.connected(i, this.#top)
  }

  // returns the number of open sites
  numberOfOpenSites(): number {
    return this.#openSites
  }

  // does the system percolate?
  percolates(): boolean {
    return this.#weightedQuickUnion.connected(this.#top, this.#bottom)
  }

  // utility functions
  coordinatesToIndex(row: number, col: number): number {
    return this.#size * (row - 1) + col - 1
  }

  // Determines if row an col are within bounds, throws an error otherwise
  validate(row: number, col: number): void {
    const n = this.#size

    if (row < 1 || row > n) throw new IllegalArgumentException()
    if (col < 1 || col > n) throw new IllegalArgumentException()
  }

  // connect two sites
  connect(p: number, row: number, col: number) {
    try {
      this.validate(row, col)
      if (!this.isOpen(row, col)) return
      const q = this.coordinatesToIndex(row, col)
      if (this.#weightedQuickUnion.connected(p, q)) return
      this.#weightedQuickUnion.union(p, q)
    } catch (e) {
      return
    }
  }
}

/*

0 1 2
3 4 5
6 7 8

*/
