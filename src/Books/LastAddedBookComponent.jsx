import { useAppContext } from "../Store/context"

export function LastAddedBookComponent() {
  const {state} = useAppContext();
  return <p>Last Added Book: {state.lastAddedBook}</p>
}
