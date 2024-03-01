export default class IllegalArgumentException extends Error {
  constructor(message: string = 'IllegalArgumentException') {
    super(message)
    this.name = 'IllegalArgumentException'
  }
}
