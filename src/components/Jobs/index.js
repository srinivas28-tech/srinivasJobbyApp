import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import JobCard from '../JobCard'
import Profile from '../Profile'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class Jobs extends Component {
  state = {
    searchText: '',
    search: '',
    jobList: [],
    list: [],
    anuPackage: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {list, search, anuPackage} = this.state
    const empType = list.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${empType}&minimum_package=${anuPackage}&search=${search}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, option)
    if (response.ok === true) {
      const jsonData = await response.json()
      const jobList = jsonData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  onSearch = event => {
    this.setState({searchText: event.target.value})
  }

  search = () => {
    const {searchText} = this.state
    this.setState({search: searchText}, this.fetchJobDetails)
  }

  jobsCards = () => {
    const {jobList, searchText} = this.state

    if (jobList.length === 0) {
      return (
        <>
          <div className="failure-job-item-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
              alt="no jobs"
            />
            <h1>No Jobs Found</h1>
            <p>We could not find any jobs. Try other filters</p>
          </div>
        </>
      )
    }
    return (
      <div className="jobs-container">
        <div className="search-input-container">
          <input
            id="username"
            type="search"
            className="login-input"
            placeholder="Search"
            onChange={this.onSearch}
            value={searchText}
          />
          <button
            type="button"
            className="search-button"
            data-testid="searchButton"
            onClick={this.search}
          >
            <BsSearch className="search-icon" />
            {}
          </button>
        </div>
        <h1 className="description-text">Description</h1>
        <ul className="jobList">
          {jobList.map(eachItem => (
            <JobCard eachItem={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  onSetPackage = value => {
    this.setState({anuPackage: value}, this.fetchJobDetails)
  }

  onSetType = value => {
    const {list} = this.state
    list.push(value)
    console.log(list)
    this.setState({list}, this.fetchJobDetails)
  }

  FailureView = () => (
    <>
      <div className="failure-job-item-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button className="retryButton" type="button" onClick={this.retry}>
          Retry
        </button>
      </div>
    </>
  )

  retry = () => {
    this.setState({
      searchText: '',
      search: '',
      jobList: [],
      list: [],
      anuPackage: '',
      apiStatus: apiStatusConstants.initial,
    })
  }

  loader = () => (
    <div className="job-item-container" data-testid="loader">
      <div className="loader-container">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  view = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.jobsCards()
      case apiStatusConstants.failure:
        return this.FailureView()
      case apiStatusConstants.inProgress:
        return this.loader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-container">
          <Profile
            onSetPackage={this.onSetPackage}
            onSetType={this.onSetType}
          />
          {this.view()}
        </div>
      </>
    )
  }
}
export default Jobs
