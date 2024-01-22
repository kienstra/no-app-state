import TreeModel from 'tree-model'
import initialState from './initialState'

/** @param {initialState} state */
export function booksVm(state) {
  return Object.values(state.books ?? {})?.length
    ? Object.values(state.books).map((book) => {
      return { visibleName: book.name }
    })
    : []
}

/** @param {initialState} state */
export function authorsVm(state) {
  return Object.values(state.authors).reduce(
    (acc, author) => {
      return [
        ...acc,
        {
          authorName: author.name,
          bookNames: author.bookIds
            .map((bookId) => state?.books?.[bookId]?.name)
            .filter(Boolean)
            .join(', ')
        }
      ]
    },
    []
  )
}

/** @param {initialState} state */
export function isAuthorListDisplaying(state) {
  return state.isAuthorListToggledOn || authorsVm(state).length <= 4
}

/** @param {initialState} state */
export function navVm(state) {
  const node = currentNode(state)

  if (!node) {
    return state.nav
  }

  return {
    currentSelectedVisibleName: `${node.model.text} > ${node.model.id}`,
    menuItems: node.children.map((node) => {
      return { id: node.model.id, visibleName: node.model.text }
    }),
    currentSelectedBackTarget: node.parent
      ? {
        visible: true,
        id: node.parent.model.id
      }
      : state.nav.currentSelectedBackTarget,
    showBack: node.parent
      ? true
      : state.nav.showBack,
  }
}

/** @param {initialState} state */
export function currentNode(state) {
  return getTree().all((node) => {
    return node.model.id === state.router?.currentRoute.routeId
  })[0]
}

function getTree() {
  return new TreeModel().parse({
    id: 'homeLink',
    type: 'root',
    text: 'Home',
    children: [
      {
        id: 'booksLink',
        type: 'link',
        text: 'Books'
      },
      {
        id: 'authorsLink',
        type: 'link',
        text: 'Authors',
        children: [
          {
            id: 'authorsLink-authorPolicyLink',
            type: 'link',
            text: 'Author Policy'
          },
          { id: 'authorsLink-mapLink', type: 'link', text: 'View Map' }
        ]
      }
    ]
  })
}
