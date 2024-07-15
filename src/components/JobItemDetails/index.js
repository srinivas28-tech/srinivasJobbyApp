import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {FaRegStar, FaExternalLinkAlt} from 'react-icons/fa'
import {IoLocationOutline, IoFolder} from 'react-icons/io5'
import Header from '../Header'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobItemDetails extends Component {
  state = {
    list: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.fetchJobDetails()
  }

  fetchJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const option = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, option)
    if (response.ok === true) {
      const jsonData = await response.json()
      console.log(jsonData)
      const eachItem = jsonData.job_details

      const jobList = {
        lifeAtCompany: {
          description: eachItem.life_at_company.description,
          imageUrl: eachItem.life_at_company.image_url,
        },
        skills: eachItem.skills.map(each => ({
          name: each.name,
          imageUrl: each.image_url,
        })),
        companyWebsiteUrl: eachItem.company_website_url,
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }
      const similarJobs = jsonData.similar_jobs.map(each => ({
        companyLogoUrl: each.company_logo_url,
        employmentType: each.employment_type,
        id: each.id,
        jobDescription: each.job_description,
        location: each.location,
        packagePerAnnum: each.package_per_annum,
        rating: each.rating,
        title: each.title,
      }))

      this.setState({
        list: jobList,
        similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  loader = () => (
    <div className="job-item-container" data-testid="loader">
      <div className="loader-container">
        <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
      </div>
    </div>
  )

  similar = eachItem => {
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      id,
      title,
    } = eachItem
    return (
      <li key={id} className="similar-card-container">
        <div className="company-logo-details-container">
          <div className="company-logo-container">
            <img
              src={companyLogoUrl}
              alt="similar job company logo"
              className="company-logo"
            />
            <div>
              <h1 className="company-title"> {title}</h1>
              <div className="company-icon-container">
                <FaRegStar className="star-icon" />
                <p>{rating}</p>
              </div>
            </div>
          </div>
          <div className="package-container">
            <div className="icons-container">
              <div className="particular-icon-container">
                <IoLocationOutline className="location-icon" />
                <p>{location}</p>
              </div>
              <div className="particular-icon-container">
                <IoFolder className="location-icon" />
                <p>{employmentType}</p>
              </div>
            </div>
            <p>{packagePerAnnum}</p>
          </div>
        </div>
        <h1 className="description-heading-1">Description </h1>
        <p className="description-heading">{jobDescription}</p>
      </li>
    )
  }

  card = () => {
    const {list, similarJobs} = this.state
    console.log(list)
    const {
      companyLogoUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      companyWebsiteUrl,
      title,
      skills,
      lifeAtCompany,
    } = list
    return (
      <div className="job-item-container">
        <div className="card ">
          <div className="company-logo-details-container">
            <div className="company-logo-container">
              <img
                src={companyLogoUrl}
                alt="job details company logo"
                className="company-logo"
              />
              <div>
                <h1 className="company-title"> {title}</h1>
                <div className="company-icon-container">
                  <FaRegStar className="star-icon" />
                  <p>{rating}</p>
                </div>
              </div>
            </div>
            <div className="package-container">
              <div className="icons-container">
                <div className="particular-icon-container">
                  <IoLocationOutline className="location-icon" />
                  <p>{location}</p>
                </div>
                <div className="particular-icon-container">
                  <IoFolder className="location-icon" />
                  <p>{employmentType}</p>
                </div>
              </div>
              <p>{packagePerAnnum}</p>
            </div>
          </div>
          <div className="description-link-container">
            <h1 className="description-text">Description</h1>
            <a href={companyWebsiteUrl} rel="noreferrer" target="_blank">
              Visit {'  '}
              <FaExternalLinkAlt className="linkEl" />
            </a>
          </div>
          <p className="description-heading font">{jobDescription}</p>
          <h1 className="description-text">Skills</h1>
          <ul className="skill-list">
            {skills.map(eachItem => (
              <li className="skill-list-item" key={eachItem.name}>
                <img
                  src={eachItem.imageUrl}
                  alt={eachItem.name}
                  className="skill-image"
                />
                <p>{eachItem.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="description-text">Life at Company</h1>
          <div className="lifeAtCompanyContainer">
            <p className="life">{lifeAtCompany.description}</p>
            <img
              src={lifeAtCompany.imageUrl}
              alt="Life at Company"
              className="life-at-company-image"
            />
          </div>
        </div>
        <h1 className="description-text">Similar Jobs</h1>
        <ul className="similar-item-container">
          {similarJobs.map(eachItem => this.similar(eachItem))}
        </ul>
      </div>
    )
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
      list: {},
      similarJobs: [],
      apiStatus: apiStatusConstants.initial,
    })
  }

  view = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.success()
      case apiStatusConstants.failure:
        return this.FailureView()
      case apiStatusConstants.inProgress:
        return this.loader()
      default:
        return null
    }
  }

  success = () => this.card()

  retry = () => {
    this.fetchJobDetails()
  }

  render() {
    return (
      <>
        <Header />
        {this.view()}
      </>
    )
  }
}

export default JobItemDetails
