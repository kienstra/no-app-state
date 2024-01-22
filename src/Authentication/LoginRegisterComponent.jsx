import { useState } from 'react';
import { MessagesComponent } from '../Core/Messages/MessagesComponent'
import { useAppContext } from '../Store/context';

export function LoginRegisterComponent() {
  const { dispatch } = useAppContext();
  const [email, setEmail] = useState('');
  const [option, setOption] = useState('');
  const [password, setPassword] = useState('')

  function getValidationMessages() {
    return [
      ...(email === '' ? ['No email'] : []),
      ...(password === '' ? ['No password'] : []),
    ]
  }

  return (
    <div className="login-register">
      <div className="w3-row">
        <div className="w3-col s4 w3-center">
          <br />
        </div>
        <div className="w3-col s4 w3-center logo">
          <img
            alt="logo"
            style={{ width: 160, filter: 'grayscale(100%)' }}
            src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/themes/2147767979/settings_images/iE7LayVvSHeoYcZWO4Dq_web-logo-pink-light-bg3x.png"
          />
        </div>
        <div className="w3-col s4 w3-center">
          <br />
        </div>
      </div>
      <div className="w3-row">
        <div className="w3-col s4 w3-center">
          <br />
        </div>
        <div className="w3-col s4 w3-center option">
          <input
            className="lr-submit"
            style={{ backgroundColor: '#e4257d' }}
            type="submit"
            value="login"
            onClick={() => {
              setOption('login')
            }}
          />
          <input
            className="lr-submit"
            style={{ backgroundColor: '#2E91FC' }}
            type="submit"
            value="register"
            onClick={() => {
              setOption('register')
            }}
          />
        </div>
        <div className="w3-col s4 w3-center">
          <br />
        </div>
      </div>
      <div
        className="w3-row"
        style={{
          backgroundColor: option === 'login' ? '#E4257D' : '#2E91FC',
          height: 100,
          paddingTop: 20
        }}
      >
        <form
          className="login"
          onSubmit={(event) => {
            event.preventDefault()
            dispatch({
              type: 'SET_VALIDATION_MESSAGES',
              payload: getValidationMessages(),
            });

            if (getValidationMessages().length) {
              return;
            }

            if (option === 'login') {
              dispatch({
                type: 'LOG_IN',
                payload: {email, password}
              })
            }
            if (option === 'register') {
              dispatch({
                type: 'REGISTER',
                payload: {email, password}
              })
            }
          }}
        >
          <div className="w3-col s4 w3-center">
            <input
              type="email"
              value={email}
              placeholder="Email"
              onChange={(event) => {
                setEmail(event.target.value)
              }}
            />
          </div>
          <div className="w3-col s4 w3-center">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(event) => {
                setPassword(event.target.value)
              }}
            />
          </div>
          <div className="w3-col s4 w3-center">
            <input type="submit" className="lr-submit" value={option} />
          </div>
          <br />
          <br />
          <br />
        </form>
      </div>
      <MessagesComponent />
    </div>
  )
}
