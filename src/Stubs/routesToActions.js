export default function routesToActions(routes) {
  return routes.map((route) => {
    return {
      type: 'UPDATE_ROUTE',
      payload: {
        newRouteId: route,
        params: {},
        query: {},
      },
    }
  })
}