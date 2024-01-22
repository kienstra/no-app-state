export default {
  authors: {},
  books: {},
  isAuthorListToggledOn: false,
  nav: {
    showBack: false,
    currentNode: {
      children: {},
      parent: {},
    },
    currentSelectedVisibleName: '',
    currentSelectedBackTarget: { visible: false, id: '' },
    menuItems: [],
  },
  router: {
    currentRoute: { routeId: '' },
    routes: [
      {
        routeId: 'loginLink',
        routeDef: {
          path: '/app/login',
          isSecure: false
        }
      },
      {
        routeId: 'homeLink',
        routeDef: {
          path: '/app/home',
          isSecure: true
        }
      },
      {
        routeId: 'booksLink',
        routeDef: {
          path: '/app/books',
          isSecure: true
        },
        onEnter: 'LOAD_BOOKS',
        onLeave: 'RESET_BOOKS',
      },
      {
        routeId: 'addBooksLink',
        routeDef: {
          path: '/app/books/add',
          isSecure: true
        }
      },
      {
        routeId: 'authorsLink',
        routeDef: {
          path: '/app/authors',
          isSecure: true
        },
        onEnter: 'LOAD_AUTHORS',
        onLeave: 'RESET_AUTHORS',
      },
      {
        routeId: 'authorsLink-authorPolicyLink',
        routeDef: {
          path: '/app/authors/policy',
          isSecure: false
        }
      },
      {
        routeId: 'authorsLink-mapLink',
        routeDef: {
          path: '/app/authors/map',
          isSecure: false
        }
      },
      {
        routeId: 'default',
        routeDef: {
          path: '*',
          isSecure: false
        },
      }
    ],
  },
  addedBooks: [],
  bookNames: [],
  lastAddedBook: '',
  messages: [],
  validationMessages: [],
}
