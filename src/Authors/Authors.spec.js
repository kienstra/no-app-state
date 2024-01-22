import { GetSuccessfulBookAddedStub } from '../Stubs/GetSuccessfulBookAddedStub'
import { GetSuccessfulAuthorAddedStub } from '../Stubs/GetSuccessfulAuthorAddedStub'
import { SingleBookResultStub } from '../Stubs/SingleBookResultStub'
import { SingleAuthorsResultStub } from '../Stubs/SingleAuthorsResultStub'
import { ManyAuthorsResultStub } from '../Stubs/ManyAuthorsResultStub'
import { StubHttpGateway } from '../Core/StubHttpGateway'
import { describe, expect, it, vi } from 'vitest'
import { makeReducers } from '../Store/reducer'
import { authorsVm, isAuthorListDisplaying } from '../Store/selector'
import initialState from '../Store/initialState'

const email = 'email@example.com'
const token = '12345'

function getStubGateway(authorsStub) {
  const httpGateway = new StubHttpGateway()
  const books = {
    1: 'bookA',
    2: 'bookB',
    3: 'bookC',
  }
  httpGateway.get = vi.fn().mockImplementation((path) => {
    const pattern = /\/book\?emailOwnerId=[a-z]+@[a-z]+\.[a-z]+&bookId=(\d)/
    if (path.indexOf('/authors') !== -1) {
      return Promise.resolve(authorsStub())
    } else if (path.match(pattern)) {
      const bookId = Number(path.match(pattern)[1])
      return Promise.resolve(SingleBookResultStub(books[bookId], bookId))
    }
  })

  httpGateway.post = vi.fn().mockImplementation((path) => {
    if (path.match(/^\/?books/)) {
      return Promise.resolve(GetSuccessfulBookAddedStub(1))
    } else if (path.match(/^\/?authors/)) {
      return Promise.resolve(GetSuccessfulAuthorAddedStub())
    }
  })

  return httpGateway
}

describe('authors', () => {
  describe('loading', () => {
    it('should load list author and books into viewModel', async () => {
      expect(
        authorsVm(
          await makeReducers(getStubGateway(SingleAuthorsResultStub))(
            {
              ...initialState,
              user: { email: 'email@example.com', token},
            },
            {type: 'LOAD_AUTHORS'}
          )
        )
      ).toEqual([
        { authorName: 'Isaac Asimov', bookNames: 'bookA, bookB' },
        {
          authorName: 'Kenneth Graeme',
          bookNames: 'bookC'
        }
      ])
    })

    it('should show author list (toggle) when has authors', async () => {
      expect(
        isAuthorListDisplaying(
          await makeReducers(getStubGateway(SingleAuthorsResultStub))(
            {
              ...initialState,
              user: { email: email }
            },
            {type: 'LOAD_AUTHORS'}
          )
        )
      ).toEqual(true)
    })

    it('should hide author list (toggle) when has more than 4 authors', async () => {
      const httpGateway = getStubGateway(ManyAuthorsResultStub)

      expect(
        isAuthorListDisplaying(
          await makeReducers(httpGateway)(
            {
              ...initialState,
              user: { email: email }
            },
            {type: 'LOAD_AUTHORS'}
          )
        )
      ).toEqual(false)
    })
  })

  describe('saving', () => {
    it('should allow books to be staged and then save authors and books to api', async () => {
      const authorName = 'Ernest Hemingway'
      const httpGateway = getStubGateway(SingleAuthorsResultStub)
      const state = await makeReducers(httpGateway)(
        {
          ...initialState,
          user: { email, token },
        },
        {
          type: 'ADD_AUTHOR_BOOK',
          payload: 'A Movable Feast',
        }
      )

      const newState = await makeReducers(httpGateway)(
        state,
        {
          type: 'ADD_AUTHOR_BOOK',
          payload: 'The Sun Also Rises',
        }
      )

      expect(
        (await makeReducers(httpGateway)(
          newState,
          {
            type: 'ADD_AUTHOR',
            payload: 'Ernest Hemingway',
          }
        )).messages
      ).toEqual(['Author Added'])

      expect(httpGateway.post).toHaveBeenLastCalledWith(
        '/authors',
        {
          bookIds: [1, 1],
          emailOwnerId: email,
          name: authorName
        },
        token
      )
    })
  })
})
