export default class Percolation {
  #grid: number[]

  // creates n-by-n grid, with all sites initially blocked
  constructor(n: number) {
    this.#grid = new Array(n)
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
}
