import { describe, expect, it, vi } from 'vitest'
import { makeReducers, runActions } from '../Store/reducer'
import initialState from '../Store/initialState'
import { StubHttpGateway } from '../Core/StubHttpGateway'
import { SingleBooksResultStub } from '../Stubs/SingleBooksResultStub'
import { GetSuccessfulBookAddedStub } from '../Stubs/GetSuccessfulBookAddedStub'
import { booksVm } from '../Store/selector'

const newBookName = 'The Odyssey'
const email = 'jb@example.com'
const token = '12345'

describe('books', () => {
  describe('loading', () => {
    it('shows book list', async () => {
      const httpGateway = new StubHttpGateway()
      httpGateway.get = vi.fn().mockImplementationOnce(() => {
        return Promise.resolve(SingleBooksResultStub())
      })

      const state = await makeReducers(httpGateway)(
        {
          ...initialState,
          user: { email },
        },
        {
          type: 'LOAD_BOOKS',
          payload: 881,
        }
      )

      expect(booksVm(state).length).toEqual(4)
      expect(booksVm(state)[0].visibleName).toEqual('Wind in the willows')
      expect(booksVm(state)[3].visibleName).toEqual('Wind In The Willows 2')
    })
  })

  describe('adding a book', () => {
    it('makes a request to add the book', async () => {
      const httpGateway = new StubHttpGateway()
      httpGateway.post = vi.fn().mockImplementationOnce(() => {
        return Promise.resolve(GetSuccessfulBookAddedStub())
      })

      await makeReducers(httpGateway)(
        {
          ...initialState,
          user: { email, token },
        },
        {
          type: 'ADD_BOOK',
          payload: newBookName,
        }
      )

      expect(httpGateway.post).toHaveBeenCalledWith(
        '/books',
        {
          name: newBookName,
          emailOwnerId: email,
        },
        token
      )
    })

    it('resets books', async () => {
      const httpGateway = new StubHttpGateway()
      httpGateway.post = vi.fn().mockImplementationOnce(() => {
        return Promise.resolve(GetSuccessfulBookAddedStub())
      })

      expect(
        (await runActions(
          [
            {
              type: 'ADD_BOOK',
              payload: newBookName,
            },
            {type: 'RESET_BOOKS'}
          ],
          makeReducers(httpGateway),
          {
            ...initialState,
            user: { email, token },
          }
        )).books
      ).toEqual({})
    })

    it('shows the last book added', async () => {
      expect(
        (await makeReducers(new StubHttpGateway())(
          {
            ...initialState,
            user: { email, token },
          },
          {
            type: 'ADD_BOOK',
            payload: newBookName,
          }
        )).lastAddedBook
      ).toBe(newBookName)
    })

    it('shows the message', async () => {
      const httpGateway = new StubHttpGateway()
      httpGateway.post = vi.fn().mockImplementationOnce(() => {
        return Promise.resolve(GetSuccessfulBookAddedStub())
      })

      expect(
        (await makeReducers(httpGateway)(
          {
            ...initialState,
            user: { email, token },
          },
          {
            type: 'ADD_BOOK',
            payload: newBookName,
          }
        )).messages
      ).toEqual(['Book Added'])
    })
  })
})
