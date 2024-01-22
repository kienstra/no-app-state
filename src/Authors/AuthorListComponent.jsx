import { authorsVm } from '../Store/selector'
import { useAppContext } from '../Store/context'

export function AuthorListComponent() {
  const {state} = useAppContext()

  return (
    <>
      {authorsVm(state).map((author, index) => {
        return (
          <div key={index}>
            ({author.authorName}) | ({author.bookNames})
          </div>
        )
      })}
      <br />
    </>
  )
}
