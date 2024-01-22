export function GetFailedRegistrationStub() {
  return {
    success: false,
    result: {
      message: 'Failed: credentials not valid must be (email and >3 chars on password).'
    }
  }
}
