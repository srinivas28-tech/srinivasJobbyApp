import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Profile extends Component {
  state = {apiStatus: apiStatusConstants.initial, profileDetails: {}}

  componentDidMount = () => {
    this.fetchProfileDetails()
  }

  fetchProfileDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(apiUrl, option)
    if (response.ok === true) {
      const jsonData = await response.json()
      const details = {
        name: jsonData.profile_details.name,
        profileImageUrl: jsonData.profile_details.profile_image_url,
        shortBio: jsonData.profile_details.short_bio,
      }
      this.setState({
        profileDetails: details,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  filter = () => {
    const {onSetPackage, onSetType} = this.props
    return (
      <>
        <div className="filter-profile-container">
          <h1 className="profile-heading">Type of Employment</h1>
          <ul className="filter-list">
            {employmentTypesList.map(eachItem => {
              const changeCheckBox = () => {
                onSetType(eachItem.employmentTypeId)
              }
              const {employmentTypeId, label} = eachItem
              return (
                <li className="filter-list-item" key={employmentTypeId}>
                  <input
                    onChange={changeCheckBox}
                    className="checkBox"
                    type="checkbox"
                    id={employmentTypeId}
                  />
                  <label htmlFor={employmentTypeId}>{label}</label>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="filter-profile-container">
          <h1 className="profile-heading">Salary Range</h1>
          <ul className="filter-list">
            {salaryRangesList.map(eachItem => {
              const changeRadio = () => {
                onSetPackage(eachItem.salaryRangeId)
              }
              return (
                <li className="filter-list-item" key={eachItem.salaryRangeId}>
                  <input
                    className="checkBox"
                    name="group"
                    type="radio"
                    id={eachItem.salaryRangeId}
                    onChange={changeRadio}
                  />
                  <label htmlFor={eachItem.salaryRangeId}>
                    {eachItem.label}
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      </>
    )
  }

  profile = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <>
        <div className="profile-container-name">
          <img src={profileImageUrl} alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p>{shortBio}</p>
        </div>
      </>
    )
  }

  view = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.profile()
      case apiStatusConstants.failure:
        return this.FailureView()
      case apiStatusConstants.inProgress:
        return this.loader()
      default:
        return null
    }
  }

  loader = () => (
    <div className="loader-container-profile" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  FailureView = () => (
    <div className="loader-container-profile" data-testid="loader">
      <button className="retryButton" type="button" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  retry = () => {
    this.setState({apiStatus: apiStatusConstants.initial, profileDetails: {}})
  }

  render() {
    return (
      <div className="profile-container">
        {this.view()}
        {this.filter()}
      </div>
    )
  }
}
export default Profile
