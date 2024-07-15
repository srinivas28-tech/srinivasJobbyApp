import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const onClickLogoutButton = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav className="nav">
      <ul className="header-container">
        <li>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-website-logo"
            />
          </Link>
        </li>
        <li>
          <ul className="header-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/jobs">Jobs</Link>
            </li>
          </ul>
        </li>
        <li>
          <button
            onClick={onClickLogoutButton}
            className="logout-button"
            type="button"
          >
            Logout
          </button>
        </li>
      </ul>
    </nav>
  )
}
export default withRouter(Header)
