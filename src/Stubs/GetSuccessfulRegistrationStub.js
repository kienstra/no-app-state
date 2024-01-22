export function GetSuccessfulRegistrationStub() {
  return {
    success: true,
    result: {
      token: '123456',
      message: 'Success: Limited to one test account per trainee!'
    }
  }
}
