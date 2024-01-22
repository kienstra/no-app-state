import { describe, expect, it, vi } from 'vitest'
import { GetSuccessfulRegistrationStub } from '../Stubs/GetSuccessfulRegistrationStub'
import { GetFailedRegistrationStub } from '../Stubs/GetFailedRegistrationStub'
import { GetSuccessfulUserLoginStub } from '../Stubs/GetSuccessfulUserLoginStub'
import { GetFailedUserLoginStub } from '../Stubs/GetFailedUserLoginStub'
import routesToActions from '../Stubs/routesToActions'
import { makeReducers, runActions } from '../Store/reducer'
import initialState from '../Store/initialState'
import { StubHttpGateway } from '../Core/StubHttpGateway'
import { StubRouterGateway } from '../Routing/StubRouterGateway'

describe('Authentication', () => {
  describe('routing', () => {
    it('should block wildcard *(default) routes when not logged in', async () => {
      expect(
        ( await runActions(
          routesToActions(['default']),
          makeReducers(
            new StubHttpGateway(),
            new StubRouterGateway()
          ),
          {
            ...initialState,
            user: {
              email: 'email@example.com',
              password: 'password',
            },
          }
        ) ).router.currentRoute.routeId
      ).toEqual('loginLink')
    })

    it('should block secure routes when not logged in', async () => {
      expect(
        ( await runActions(
          routesToActions(['authorsLink']),
          makeReducers(
            new StubHttpGateway(),
            new StubRouterGateway()
          ),
          {
            ...initialState,
            user: {
              email: 'email@example.com',
              password: 'password',
            },
          }
        ) ).router.currentRoute.routeId
      ).toEqual('loginLink')
    })

    it('should allow public routes when not logged in', async () => {
      expect(
        ( await runActions(
          routesToActions(['authorsLink-authorPolicyLink']),
          makeReducers(
            new StubHttpGateway(),
            new StubRouterGateway()
          ),
          {
            ...initialState,
            user: {
              email: 'email@example.com',
              password: 'password',
            },
          }
        ) ).router.currentRoute.routeId
      ).toEqual('authorsLink-authorPolicyLink')
    })

    describe('register', () => {
      it('redirects to the login link on success', async () => {
        const httpGateway = new StubHttpGateway()
        const routerGateway = new StubRouterGateway()
        httpGateway.post = vi.fn().mockImplementation(() => {
          return Promise.resolve(GetSuccessfulRegistrationStub())
        })

        expect((await makeReducers(
          httpGateway,
          routerGateway
        )(
          initialState,
          {
            type: 'REGISTER',
            payload: {
              email: 'email@example.com',
              password: 'password',
            },
          })).router.currentRoute.routeId).toEqual('loginLink')
      })
    })

    it('should show failed server message on failed register', async () => {
      const httpGateway = new StubHttpGateway()
      const routerGateway = new StubRouterGateway()
      httpGateway.post = vi.fn().mockImplementation(() => {
        return Promise.resolve(GetFailedRegistrationStub())
      })

      expect((await makeReducers(
        httpGateway,
        routerGateway
      )(
        initialState,
        {
          type: 'REGISTER',
          payload: {
            email: 'email@example.com',
            password: 'password',
          },
        })).messages).toEqual(['Failed: could not register.'])
    })
    // })

    it('should start at loginLink ', async () => {
      expect(
        (await runActions(
          routesToActions(['homeLink']),
          makeReducers(
            new StubHttpGateway(),
            new StubRouterGateway()
          ),
          {
            ...initialState,
            user: {
              email: 'email@example.com',
              password: 'password',
            },
          }
        ) ).router.currentRoute.routeId
      ).toEqual('loginLink')
    })

    it('should go to homeLink on successful login (and populate userModel)', async () => {
      const httpGateway = new StubHttpGateway()
      const routerGateway = new StubRouterGateway()

      httpGateway.post = vi.fn().mockImplementation(() => {
        return Promise.resolve(GetSuccessfulUserLoginStub())
      })

      expect(
        ( await runActions(
          [{
            type: 'LOG_IN',
            payload: {
              email: 'email@example.com',
              password: 'password',
            }
          }],
          makeReducers(
            httpGateway,
            routerGateway
          ),
          initialState
        ) ).router.currentRoute.routeId
      ).toEqual('homeLink')
    })

    it('failed login does not redirect to home', async () => {
      const httpGateway = new StubHttpGateway()
      const routerGateway = new StubRouterGateway()

      httpGateway.post = vi.fn().mockImplementation(() => {
        return Promise.resolve(GetFailedUserLoginStub())
      })

      expect(
        ( await runActions(
          [{
            type: 'LOG_IN',
            payload: {
              email: 'email@example.com',
              password: 'password',
            }
          }],
          makeReducers(
            httpGateway,
            routerGateway
          ),
          initialState
        ) ).router.currentRoute.routeId
      ).not.toEqual('homeLink')
    })

    it('should show failed user message on failed login', async () => {
      const httpGateway = new StubHttpGateway()
      const routerGateway = new StubRouterGateway()

      httpGateway.post = vi.fn().mockImplementation(() => {
        return Promise.resolve(GetFailedUserLoginStub())
      })

      expect(
        ( await runActions(
          [{
            type: 'LOG_IN',
            payload: {
              email: 'email@example.com',
              password: 'password',
            }
          }],
          makeReducers(
            httpGateway,
            routerGateway
          ),
          initialState
        ) ).messages
      ).toEqual(['Failed: no user record.'])
    })

    it('should clear messages on route change', async () => {
      const httpGateway = new StubHttpGateway()
      const routerGateway = new StubRouterGateway()

      httpGateway.post = vi.fn().mockImplementation(() => {
        return Promise.resolve(GetFailedUserLoginStub())
      })

      expect(
        (await runActions(
          [
            {
              type: 'LOG_IN',
              payload: {
                email: 'email@example.com',
                password: 'password',
              },
            },
            {
              type: 'UPDATE_ROUTE',
              payload: { newRouteId: 'homeLink' },
            }
          ],
          makeReducers(
            httpGateway,
            routerGateway
          ),
          initialState
        )).messages
      ).toEqual([])
    })

    it('should log out', async () => {
      const httpGateway = new StubHttpGateway()
      const routerGateway = new StubRouterGateway()

      httpGateway.post = vi.fn().mockImplementation(() => {
        return Promise.resolve(GetFailedUserLoginStub())
      })

      const state = await runActions(
        [{type: 'LOG_OUT'}],
        makeReducers(
          httpGateway,
          routerGateway
        ),
        {
          ...initialState,
          user: {
            email: 'email@example.com',
            password: 'password',
          },
        }
      )

      expect(state.user).toEqual({email: '', token: ''})
      expect(state.router.currentRoute.routeId).toEqual('loginLink')
    })
  })
})
