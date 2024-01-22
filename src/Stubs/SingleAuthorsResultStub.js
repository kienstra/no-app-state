export function SingleAuthorsResultStub() {
  return {
    success: true,
    result: [
      {
        authorId: 1,
        name: 'Isaac Asimov',
        bookIds: [1, 2],
        latLon: '51.4556852, -0.9904706'
      },
      {
        authorId: 2,
        name: 'Kenneth Graeme',
        bookIds: [3],
        latLon: '9,2'
      }
    ]
  }
}
