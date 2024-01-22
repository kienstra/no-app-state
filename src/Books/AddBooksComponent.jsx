import { useAppContext } from '../Store/context';

export function AddBooksComponent({addBook, newBookName}) {
  const {dispatch} = useAppContext();
  function getValidationMessages(newBookName) {
    return newBookName
      ? []
      : ['No book name'];
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const name = event.target.bookName.value;
          if (getValidationMessages(name).length) {
            dispatch({
              type: 'SET_VALIDATION_MESSAGES',
              payload: getValidationMessages(name)
            })

            return
          }

          addBook(name)
          event.target.reset()
        }}
      >
        <label>
          <input
            type="text"
            id="bookName"
            placeholder="Enter book name"
          />
          <input type="submit" value="Add Book" />
        </label>
      </form>
    </div>
  )
}
