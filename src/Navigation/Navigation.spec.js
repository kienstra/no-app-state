import { describe, expect, it, vi } from 'vitest';
import { makeReducers, runActions } from '../Store/reducer';
import initialState from '../Store/initialState';
import { navVm } from '../Store/selector';
import { StubHttpGateway } from '../Core/StubHttpGateway';
import { StubRouterGateway } from '../Routing/StubRouterGateway';
import { GetSuccessfulUserLoginStub } from '../TestTools/GetSuccessfulUserLoginStub';
import routesToActions from '../TestTools/routesToActions';
import { SingleBooksResultStub } from '../TestTools/SingleBooksResultStub';

function gateways() {
  const httpGateway = new StubHttpGateway();
  const routerGateway = new StubRouterGateway();

  httpGateway.get = vi.fn().mockImplementation(() => {
    return Promise.resolve(SingleBooksResultStub())
  })
  httpGateway.post = vi.fn().mockImplementation(() => {
    return Promise.resolve(GetSuccessfulUserLoginStub())
  })

  return [httpGateway, routerGateway];
}

describe('navigation', () => {
  it('anchor default state', () => {
    const vm = navVm(initialState);
    expect(vm.currentSelectedVisibleName).toBe('')
    expect(vm.showBack).toBe(false)
    expect(vm.menuItems).toEqual([])
  })

  it('goes to a non-existent route', async () => {
    expect(
      navVm(
        await runActions(
          routesToActions(['doesNotExist']),
          makeReducers(...gateways()),
          {
            ...initialState,
            user: {
              email: 'email@example.com',
              password: 'password',
            },
          }
        )
     ).currentSelectedVisibleName
    ).toBe('')
  })

  it('should navigate to the navigation link', async () => {
    expect(
      navVm(
        await runActions(
          [
            {
              type: 'LOG_IN',
              payload: {
                email: 'email@example.com',
                password: 'password',
              }
            },
            ...routesToActions(['authorsLink']),
          ],
          makeReducers(...gateways()),
          initialState
        )
      ).currentSelectedVisibleName
    ).toBe('Authors > authorsLink')
  })

  it('should navigate down the navigation tree', async () => {
    expect(
      navVm(
        await runActions(
          [
            {
              type: 'LOG_IN',
              payload: {
                email: 'email@example.com',
                password: 'password',
              }
            },
            ...routesToActions(['authorsLink-authorPolicyLink']),
          ],
          makeReducers(...gateways()),
          initialState
        )
      ).currentSelectedVisibleName
    ).toBe('Author Policy > authorsLink-authorPolicyLink')
  })

  it('should go to all links', async () => {
    expect(
      navVm(
        await runActions(
          [
            {
              type: 'LOG_IN',
              payload: {
                email: 'email@example.com',
                password: 'password',
              },
            },
            ...routesToActions([
              'homeLink',
              'booksLink',
              'authorsLink',
              'authorsLink-authorPolicyLink',
              'authorsLink-mapLink',
            ]),
          ],
          makeReducers(...gateways()),
          initialState
        )
      ).currentSelectedVisibleName
    ).toBe('View Map > authorsLink-mapLink')
  })
})
