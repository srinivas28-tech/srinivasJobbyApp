import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {username: '', password: '', showErrMsg: false, errorMsg: ''}

  onSubmitFailure = err => {
    this.setState({showErrMsg: true, errorMsg: err})
  }

  onSubmitSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 3, path: '/'})
    const {history} = this.props
    history.replace('/')
  }

  onSubmitPassword = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const data = {
      username,
      password,
    }
    const apiUrl = 'https://apis.ccbp.in/login'
    const option = {
      method: 'POST',
      body: JSON.stringify(data),
    }
    const response = await fetch(apiUrl, option)
    const jsonData = await response.json()
    if (response.ok) {
      this.onSubmitSuccess(jsonData.jwt_token)
    } else {
      this.onSubmitFailure(jsonData.error_msg)
    }
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  render() {
    const {username, password, showErrMsg, errorMsg} = this.state
    console.log(username, password)
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <div className="website-logo">
          <div className="image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <form className="form-container" onSubmit={this.onSubmitPassword}>
            <div className="input-container">
              <label className="label" htmlFor="username">
                USERNAME
              </label>
              <br />
              <input
                id="username"
                placeholder="rahul"
                value={username}
                type="text"
                className="login-input"
                onChange={this.onChangeUsername}
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                PASSWORD
              </label>
              <br />
              <input
                placeholder="rahul@2021"
                id="password"
                value={password}
                className="login-input"
                type="password"
                onChange={this.onChangePassword}
              />
            </div>

            <button className="login-button" type="submit">
              Login
            </button>
          </form>
          {showErrMsg && <p className="err">*{errorMsg}</p>}
        </div>
      </div>
    )
  }
}

export default Login
