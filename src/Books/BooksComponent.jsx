import { AddBooksComponent } from './AddBooksComponent'
import { BookListComponent } from './BookListComponent'
import { LastAddedBookComponent } from './LastAddedBookComponent'
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { useAppContext } from '../Store/context'
import { booksVm } from '../Store/selector'

export function BooksComponent() {
  const { dispatch, state } = useAppContext()
  return (
    <>
      <h1>Books</h1>
      <LastAddedBookComponent lastAddedBook={state.lastAddedBook} />
      <br />
      <AddBooksComponent
        addBook={(book) => dispatch({type: 'ADD_BOOK', payload: book})}
      />
      <br />
      <BookListComponent viewModel={booksVm(state)} />
      <br />
      <MessagesComponent />
    </>
  )
}
