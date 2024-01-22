import { useAppContext } from '../../Store/context'

export function MessagesComponent() {
  const {state} = useAppContext()

  return (
    <>
      {state.messages.map((item, i) => {
        return (
          <div style={{ backgroundColor: 'red' }} key={i}>
            {' - '}
            {item}
          </div>
        )
      })}
      {state.validationMessages.map((item, i) => {
        return (
          <div style={{ backgroundColor: 'orange' }} key={i}>
            {' - '}
            {item}
          </div>
        )
      })}
    </>
  )
}
