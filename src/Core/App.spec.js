import { describe, expect, it, vi } from 'vitest'
import { makeReducers, runActions } from '../Store/reducer'
import initialState from '../Store/initialState'
import { StubHttpGateway } from './StubHttpGateway'
import { StubRouterGateway } from '../Routing/StubRouterGateway'

describe('init', () => {
  it('inits app', async () => {
    const httpGateway = new StubHttpGateway()
    const routerGateway = new StubRouterGateway()
    routerGateway.registerRoutes = vi.fn()

    await makeReducers(httpGateway, routerGateway)(
      initialState,
      { type: 'INIT' }
    )

    expect(routerGateway.registerRoutes).toHaveBeenCalledOnce()
  })
})
