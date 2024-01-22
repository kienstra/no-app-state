export function SingleBookResultStub(
  bookName = 'I, Robot',
  bookId = 1
) {
  return {
    success: true,
    result: [
      {
        bookId,
        name: bookName,
        emailOwnerId: 'email@example.com',
        devOwnerId: 'dev@example.com'
      }
    ]
  }
}
