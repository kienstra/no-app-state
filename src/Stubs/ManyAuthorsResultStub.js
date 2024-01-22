export function ManyAuthorsResultStub() {
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
      },
      {
        authorId: 3,
        name: 'Ernest Hemingway',
        bookIds: [4],
        latLon: '9,2'
      },
      {
        authorId: 4,
        name: 'John Doe',
        bookIds: [5, 6],
        latLon: '9,2'
      },
      {
        authorId: 5,
        name: 'Jane Doe',
        bookIds: [7],
        latLon: '9,2'
      }
    ]
  }
}
