export function GetSuccessfulUserLoginStub() {
  return {
    success: true,
    result: {
      token: '123456',
      message: 'Success: found user.',
    }
  }
}
