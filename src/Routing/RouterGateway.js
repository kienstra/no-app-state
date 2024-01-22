import Navigo from 'navigo'

export class RouterGateway {
  constructor() {
    this.navigo = new Navigo('/')
  }

  registerRoutes(routes) {
    this.navigo
      .on(routes)
      .notFound(() => {})
      .resolve()
  }

  unload() {
    this.navigo.destroy()
  }

  goToId(name, queryString) {
    this.navigo.navigateByName(name, queryString)
  }
}
