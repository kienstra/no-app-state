import responseToPm from '../Books/responseToPm'
import singleResponseToPm from '../Books/singleResponseToPm'
import responseToMessage from '../Core/Messages/responseToMessage'
import hasSchema from './hasSchema'
import initialState from './initialState'
import { currentNode } from './selector'
import { HttpGateway } from '../Core/HttpGateway'
import { RouterGateway } from '../Routing/RouterGateway'

export function runActions(actions, reducer, state) {
  return actions.reduce(
    async (s, action) => {
      return reducer(await s, action)
    },
    Promise.resolve(state)
  )
}

function makeAddBook(httpGateway) {
  return async (state, action) => {
    return {
      ...state,
      lastAddedBook: action.payload,
      messages: [
        ...state.messages,
        responseToMessage(
          await httpGateway.post(
            '/books',
            {
              name: action.payload,
              emailOwnerId: state.user.email,
            },
            state.user.token
          )
        ).serverMessage
      ],
      books: responseToPm(
        await httpGateway.get(`/books?emailOwnerId=${state.user.email}`, state.user.token)
      ),
    }
  }
}

function makeLoadBooks(httpGateway) {
  return async (state, _) => {
    return {
      ...state,
      books: responseToPm(await httpGateway.get(`/books?emailOwnerId=${state.user.email}`, state.user.token)),
    }
  }
}

function resetBooks(state, _) {
  return {
    ...state,
    books: {},
  }
}

function resetAuthors(state, _) {
  return {
    ...state,
    authors: {},
  }
}

function makeLogIn(httpGateway, routerGateway) {
  return async (state, action) => {
    const email = action.payload.email
    const password = action.payload.password
    const loginResponse = await httpGateway.post('/login', {
      email,
      password,
    })

    return loginResponse?.success
      ? makeUpdateRoute(httpGateway, routerGateway)(
        {
          ...state,
          user: {
            email,
            password,
            token: loginResponse.result.token
          },
          messages: [],
        },
        {
          payload: {
            newRouteId: 'homeLink',
            params: {},
            query: {},
          }
        }
      )
      : {
        ...state,
        messages: [
          'Failed: no user record.',
          ...state.messages,
        ]
      }
  }
}

function makeRegister(httpGateway, routerGateway) {
  return async (state, action) => {
    const email = action.payload.email
    const password = action.payload.password
    const registerReponse = await httpGateway.post('/register', {
      email,
      password,
    })

    return registerReponse.success
      ? makeUpdateRoute(httpGateway, routerGateway)(
        {
          ...state,
          user: {
            email,
            password,
          },
          messages: [
            responseToMessage(registerReponse).serverMessage
          ],
        },
        {
          payload: {
            newRouteId: 'loginLink',
            params: {},
            query: {},
          }
        }
      )
      : {
        ...state,
        messages: [
          'Failed: could not register.',
          ...state.messages,
        ]
      }
  }
}

function makeLogOut(httpGateway, routerGateway) {
  return async (state, _) => {
    return makeUpdateRoute(httpGateway, routerGateway)(
      {
        ...state,
        user: {
          email: '',
          token: '',
        },
      },
      {
        payload: {
          newRouteId: 'loginLink',
          params: {},
          query: {},
        }
      }
    )
  }
}

function findRoute(state, routeId) {
  return state.router.routes.find((route) => {
    return route.routeId === routeId
  }) || { routeId: 'loadingSpinner', routeDef: { path: '' } }
}

function makeUpdateRoute(httpGateway, routerGateway) {
  return function updateRoute(state, action) {
    const { newRouteId, params, query } = action.payload
    const oldRoute = findRoute(state, state.router.currentRoute.routeId)
    const newRoute = findRoute(state, newRouteId)
    const hasToken = !!state?.user?.token
    const protectedOrUnauthenticatedRoute =
      (newRoute.routeDef.isSecure && hasToken === false) || newRoute.routeDef.path === '*'
    const publicOrAuthenticatedRoute =
      (newRoute.routeDef.isSecure && hasToken === true) || newRoute.routeDef.isSecure === false

    routerGateway.goToId(
      protectedOrUnauthenticatedRoute
        ? 'loginLink'
        : newRoute.routeId
    )

    return protectedOrUnauthenticatedRoute
      ? {
        ...state,
        messages: [],
        router: {
          ...state.router,
          currentRoute: {
            ...findRoute(state, 'loginLink'),
            params,
            query,
          },
        }
      }
      : runActions(
        [
          {type: publicOrAuthenticatedRoute && oldRoute?.onLeave ? oldRoute?.onLeave : 'IDENTITY'},
          {type: publicOrAuthenticatedRoute && newRoute?.onEnter ? newRoute?.onEnter : 'IDENTITY'},
        ],
        makeReducers(httpGateway, routerGateway),
        {
          ...state,
          messages: [],
          router: {
            ...state.router,
            currentRoute: {
              ...newRoute,
              params,
              query,
            }
          },
        },
      )
  }
}

function makeUpdateProperty(property) {
  return (state, action) => {
    return {
      ...state,
      [property]: action.payload,
    }
  }
}

function makeAddAuthor(httpGateway) {
  return async (state, action) => {
    return state.addedBooks?.length
      ? makeLoadAuthors(httpGateway)(
        {
          ...state,
          messages: [
            ...state.messages,
            responseToMessage(
              await httpGateway.post(
                '/authors',
                {
                  name: action.payload,
                  emailOwnerId: state.user.email,
                  bookIds: await Promise.all(
                    state.addedBooks.map(async ({visibleName}) => {
                      const response = await httpGateway.post('/books', { name: visibleName, emailOwnerId: state.user.email }, state.user.token)
                      return response?.success && response?.result?.bookId ? response.result.bookId : null
                    })
                  )
                },
                state.user.token
              )
            ).serverMessage,
          ],
          addedBooks: [],
        }
      )
      : {
        ...state,
        messages: [
          ...state.messages,
          'Please add a book'
        ],
      }
  }
}

function addAuthorBook(state, action) {
  return {
    ...state,
    addedBooks: [...(state?.addedBooks ?? []), { visibleName: action.payload }],
  }
}

function makeInit(routerGateway) {
  return (state, _) => {
    routerGateway.registerRoutes(
      state.router.routes.reduce(
        (acc, route) => {
          const r = findRoute(state, route.routeId)
          return {
            ...acc,
            [r.routeDef.path]: {
              as: r.routeId,
            }
          }
        },
        {}
      )
    )

    return state
  }
}

function makeLoadAuthors(httpGateway) {
  return async (state, _) => {
    const authorsResponse = await httpGateway.get(`/authors?emailOwnerId=${state.user.email}`, state.user.token)
    if (!authorsResponse?.success) {
      throw new Error(`failed request for authors: ${authorsResponse}`)
    }

    const authors = authorsResponse?.result?.reduce((accumulator, author) => {
      return {
        ...accumulator,
        [author.authorId]: {
          name: author.name,
          bookIds: accumulator[author.authorId]?.bookIds?.length
            ? [...accumulator[author.authorId].bookIds, ...author.bookIds]
            : author?.bookIds ?? []
        }
      }
    }, {})

    const bookIds = Object.values(authors ?? {})?.reduce(
      (acc, author) => {
        return [...acc, ...author.bookIds]
      },
      []
    )

    const newBooks = await Promise.all(
      bookIds.map(
        async (bookId) => {
          return singleResponseToPm(
            await httpGateway.get(`/book?emailOwnerId=${state.user.email}&bookId=${bookId}`, state.user.token)
          )
        }
      )
    )

    return {
      ...state,
      authors,
      books: {
        ...state.books,
        ...newBooks.reduce((acc, book) => {
          return {
            ...acc,
            [book.bookId]: book,
          }
        }, {}),
      },
    }
  }
}

function makeNavigateBack(...gateways) {
  return (state, _) => {
    return makeUpdateRoute(...gateways)(
      state,
      {payload: {newRouteId: currentNode(state)?.parent.model.id}}
    )
  }
}

function toggleAuthorList(state) {
  return {
    ...state,
    isAuthorListToggledOn: !state.isAuthorListToggledOn,
  }
}

export function makeReducers(
  httpGateway,
  routerGateway
) {
  return async (state, action) => {
    const actions = {
      'ADD_BOOK': makeAddBook(httpGateway),
      'LOAD_BOOKS': makeLoadBooks(httpGateway),
      'RESET_BOOKS': resetBooks,
      'NEW_AUTHOR_BOOK': makeUpdateProperty('newAuthorBook'),
      'IDENTITY': x => x,
      'ADD_AUTHOR': makeAddAuthor(httpGateway),
      'ADD_AUTHOR_BOOK': addAuthorBook,
      'INIT': makeInit(routerGateway),
      'LOAD_AUTHORS': makeLoadAuthors(httpGateway),
      'NAVIGATE_BACK': makeNavigateBack(httpGateway, routerGateway),
      'RESET_AUTHORS': resetAuthors,
      'SET_VALIDATION_MESSAGES': makeUpdateProperty('validationMessages'),
      'LOG_IN': makeLogIn(httpGateway, routerGateway),
      'REGISTER': makeRegister(httpGateway, routerGateway),
      'LOG_OUT': makeLogOut(httpGateway, routerGateway),
      'UPDATE_ROUTE': makeUpdateRoute(httpGateway, routerGateway),
      'TOGGLE_AUTHOR_LIST': toggleAuthorList,
    }

    return validateSchema(
      await actions[action.type](state, action),
      initialState
    )
  }
}

function validateSchema(state, schema) {
  if (!hasSchema(state, schema)) {
    throw new Error(`State does not conform to schema.
      State: ${JSON.stringify(state)}
      Schema: ${JSON.stringify(schema)}`)
  }

  return state
}

export const reducer = makeReducers(new HttpGateway(), new RouterGateway())
