import { describe, expect, it, vi } from 'vitest';
import { GetSuccessfulRegistrationStub } from '../Stubs/GetSuccessfulRegistrationStub'
import { GetFailedRegistrationStub } from '../Stubs/GetFailedRegistrationStub'
import { GetSuccessfulUserLoginStub } from '../Stubs/GetSuccessfulUserLoginStub'
import { GetFailedUserLoginStub } from '../Stubs/GetFailedUserLoginStub'
import routesToActions from '../Stubs/routesToActions';
import { makeReducers, runActions } from '../Store/reducer';
import initialState from '../Store/initialState';
import { StubHttpGateway } from '../Core/StubHttpGateway';
import { StubRouterGateway } from '../Routing/StubRouterGateway';

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

  //   it('should allow public route when not logged in', async () => {
  //     await router.goToId('authorsLink-authorPolicyLink')
  //     expect(routerGateway.goToId).toHaveBeenLastCalledWith('authorsLink-authorPolicyLink')
  //   })
  // })

  // describe('register', () => {
  //   it('should show successful user message on successful register', async () => {
  //     dataGateway.post = jest.fn().mockImplementation(() => {
  //       return Promise.resolve(GetSuccessfulRegistrationStub())
  //     })

  //     await loginRegisterPresenter.register()

  //     expect(loginRegisterPresenter.showValidationWarning).toBe(false)
  //     expect(loginRegisterPresenter.messages).toEqual(['User registered'])
  //   })

  //   it('should show failed server message on failed register', async () => {
  //     dataGateway.post = jest.fn().mockImplementation(() => {
  //       return Promise.resolve(GetFailedRegistrationStub())
  //     })

  //     await loginRegisterPresenter.register()

  //     expect(loginRegisterPresenter.showValidationWarning).toBe(true)
  //     expect(loginRegisterPresenter.messages).toEqual([GetFailedRegistrationStub().result.message])
  //   })
  // })

//   it('should start at loginLink ', async () => {
//     await router.goToId('homeLink')
//     expect(routerRepository.currentRoute.routeId).toBe('loginLink')
//   })

//   it('should go to homeLink on successful login (and populate userModel)', async () => {
//     await appTestHarness.setupLogin(GetSuccessfulUserLoginStub)

//     expect(routerRepository.currentRoute.routeId).toBe('homeLink')
//     expect(router.userModel).toEqual({
//       email: appTestHarness.stubEmail,
//       token: GetSuccessfulUserLoginStub().result.token
//     })
//   })

   it('failed login does not redirect to home', async () => {
    const httpGateway = new StubHttpGateway();
    const routerGateway = new StubRouterGateway();

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
    const httpGateway = new StubHttpGateway();
    const routerGateway = new StubRouterGateway();

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
     // expect(loginRegisterPresenter.showValidationWarning).toBe(true)
   })

   it('should clear messages on route change', async () => {
    const httpGateway = new StubHttpGateway();
    const routerGateway = new StubRouterGateway();

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
      const httpGateway = new StubHttpGateway();
      const routerGateway = new StubRouterGateway();

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
      );

      expect(state.user).toEqual({email: '', token: ''})
      expect(state.router.currentRoute.routeId).toEqual('loginLink')
   })
  })
})
