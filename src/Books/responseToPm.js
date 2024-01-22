export default function responseToPm(reponse) {
  return reponse?.success && reponse?.result?.length
    ? reponse.result.reduce((acc, book) => {
        return {
          ...acc,
          [book.bookId]: {
            name: book.name,
            emailOwnerId: book.emailOwnerId,
            devOwnerId: book.devOwnerId
          }
        }
      }, {})
    : {}
}
