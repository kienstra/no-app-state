import { Types } from '../Core/Types'
import { BaseIOC } from '../BaseIOC'
import { FakeRouterGateway } from '../Routing/StubRouterGateway'
import { FakeHttpGateway } from '../Core/StubHttpGateway'
import { LoginRegisterPresenter } from '../Authentication/LoginRegisterPresenter'
import { SingleBooksResultStub } from './SingleBooksResultStub'
import { Router } from '../Routing/Router'
import { AppPresenter } from '../AppPresenter'
import { RouterRepository } from '../Routing/RouterRepository'

export class AppTestHarness {
  container

  dataGateway

  loginRegisterPresenter

  routerPresenter

  router

  routerGateway

  stubEmail

  stubPassword

  // 1. set up the app
  init() {
    this.container = new BaseIOC().buildBaseTemplate()

    this.container.bind(Types.IDataGateway).to(FakeHttpGateway).inSingletonScope()
    this.container.bind(Types.IRouterGateway).to(FakeRouterGateway).inSingletonScope()

    this.appPresenter = this.container.get(AppPresenter)
    this.router = this.container.get(Router)
    this.routerRepository = this.container.get(RouterRepository)
    this.routerGateway = this.container.get(Types.IRouterGateway)

    this.stubEmail = 'email@example.com'
    this.stubPassword = 'password'

    let self = this

    this.routerGateway.goToId = jest.fn().mockImplementation(async (routeId) => {
      // pivot
      await self.router.updateCurrentRoute(routeId, null, null)
    })
  }

  // 2. bootstrap the app
  bootStrap(onRouteChange) {
    this.appPresenter.load(onRouteChange)
  }

  // 3. login or register to the app
  setupLogin = async (loginStub) => {
    this.dataGateway = this.container.get(Types.IDataGateway)
    this.dataGateway.get = jest.fn().mockImplementation((path) => {
      return Promise.resolve(SingleBooksResultStub())
    })
    this.dataGateway.post = jest.fn().mockImplementation((path) => {
      return Promise.resolve(loginStub())
    })

    this.loginRegisterPresenter = this.container.get(LoginRegisterPresenter)
    this.loginRegisterPresenter.email = this.stubEmail
    this.loginRegisterPresenter.password = this.stubPassword
    await this.loginRegisterPresenter.login()
    return this.loginRegisterPresenter
  }
}
