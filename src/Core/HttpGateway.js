export class HttpGateway {
  constructor() {
    this.apiUrl = 'https://api.logicroom.co/secure-api/kienstraryan@gmail.com'
  }

  get = async (path, token) => {
    return (await fetch(`${this.apiUrl}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: token}),
      }
    })).json()
  }

  post = async (path, body, token) => {
    return (await fetch(`${this.apiUrl}${path}`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: token}),
      }
    })).json()
  }

  delete = async (path, token) => {
    return (await fetch(`${this.apiUrl}${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token && {Authorization: token}),
      }
    })).json()
  }
}
