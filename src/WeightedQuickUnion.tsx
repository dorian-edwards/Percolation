export default class WeightedQuickUnion {
  #data: number[]
  #size: number[]
  #components: number

  constructor(n: number) {
    this.#data = new Array(n)
    this.#size = new Array(n)
    this.#components = n

    for (let i = 0; i < n; i++) {
      this.#data[i] = i
      this.#size[i] = 1
    }
  }

  find(p: number) {
    let target = p
    while (target !== this.#data[target]) target = this.#data[target]

    return target
  }

  connected(p: number, q: number): boolean {
    return this.find(p) === this.find(q)
  }

  union(p: number, q: number): void {
    let pRoot = this.find(p)
    let qRoot = this.find(q)

    if (pRoot === qRoot) return
    if (this.#size[pRoot] < this.#size[qRoot]) {
      this.#data[pRoot] = this.#data[qRoot]
      this.#size[qRoot]++
    } else {
      this.#data[qRoot] = this.#data[pRoot]
      this.#size[pRoot]++
    }
    this.#components--
  }

  count(): number {
    return this.#components
  }
}
