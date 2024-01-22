import { useAppContext } from '../../Store/context';

export function MessagesComponent() {
  const {state} = useAppContext();

  return (
    <>
      {state.messages &&
        state.messages.map((item) => {
          return (
            <div style={{ backgroundColor: 'red' }} key={item}>
              {' - '}
              {item}
            </div>
          )
        })}
      {state.validationMessages &&
        state.validationMessages.map((item, i) => {
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
