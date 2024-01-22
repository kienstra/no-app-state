import { booksVm } from '../Store/selector'
import { useAppContext } from '../Store/context'

export function BookListComponent({viewModel}) {
  return (
    <>
      {viewModel?.map((book, i) => {
        return <div key={i}>{book.visibleName}</div>
      })}
      <br />
    </>
  )
}
