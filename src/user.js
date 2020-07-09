export default class user {
  constructor() {

  }

  getName() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve('tianlin !')
      }, 2000)
    })
  }
}