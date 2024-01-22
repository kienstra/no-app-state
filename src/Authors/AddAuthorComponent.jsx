import { useAppContext } from '../Store/context'

export function AddAuthorComponent() {
  const { dispatch } = useAppContext()
  function getValidationMessages(authorName) {
    return [
      ...(authorName === '' ? ['No author name'] : []),
    ]
  }

  return (
    <div>
      <form
        className="login"
        onSubmit={async (event) => {
          event.preventDefault()

          const name = event.target.authorName.value
          if (getValidationMessages(name).length) {
            dispatch({
              type: 'SET_VALIDATION_MESSAGES',
              payload: getValidationMessages(name)
            })

            return
          }

          await dispatch({
            type: 'ADD_AUTHOR',
            payload: name,
          })
          event.target.reset()
        }}
      >
        <label>
          <input
            type="text"
            id="authorName"
            placeholder="Enter author name"
          />
          <input type="submit" value="Add Author" />
        </label>
      </form>
    </div>
  )
}
