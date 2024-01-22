import { AuthorListComponent } from './AuthorListComponent'
import { AddAuthorComponent } from './AddAuthorComponent'
import { AddBooksComponent } from '../Books/AddBooksComponent'
import { BookListComponent } from '../Books/BookListComponent'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { isAuthorListDisplaying } from '../Store/selector'
import { useAppContext } from '../Store/context'

export function AuthorsComponent() {
  const {state, dispatch} = useAppContext();

  return (
    <>
      <h1>AUTHORS</h1>
      <button
        onClick={() => {
          dispatch({type: 'TOGGLE_AUTHOR_LIST'})
        }}
      >
        show author list
      </button>
      <br />
      {state.isAuthorListToggledOn ? <AuthorListComponent /> : null}
      <br />
      <AddAuthorComponent/>
      <br />
      <AddBooksComponent
        addBook={(book) => {
          dispatch({
            type: 'ADD_AUTHOR_BOOK',
            payload: book
          })
        }}
      />
      <br />
      <BookListComponent viewModel={state.addedBooks} />
      <br />
      <MessagesComponent />
    </>
  )
}
