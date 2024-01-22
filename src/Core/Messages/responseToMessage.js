export default function responseToMessage(response) {
  return { success: response?.success, serverMessage: response?.result?.message }
}
