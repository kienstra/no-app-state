export function GetSuccessfulBookAddedStub(bookId = 7) {
  return {
    success: true,
    result: { bookId, message: 'Book Added' }
  }
}
