## No App State

Thanks to Logicroom.co for the test cases and components in this repo.

What if there was no app state…

Only a single data object?

There would be almost no internal dependency.

And unit testing would be really easy.

This is like Redux.

But we won't text Redux or React.

Only the [reducer functions](src/Store/reducer.js):

```js
describe('init', () => {
  it('inits app', async () => {
    const httpGateway = new StubHttpGateway()
    const routerGateway = new StubRouterGateway()
    routerGateway.registerRoutes = vi.fn()

    await makeReducers(httpGateway, routerGateway)(
      initialState,
      { type: 'INIT' }
    )

    expect(routerGateway.registerRoutes).toHaveBeenCalledOnce()
  })
})
```
