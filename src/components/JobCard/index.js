import {Link} from 'react-router-dom'
import {FaRegStar} from 'react-icons/fa'
import {IoLocationOutline, IoFolder} from 'react-icons/io5'
import './index.css'

const JobCard = props => {
  const {eachItem} = props
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
    <Link to={`/jobs/${id}`} className="nav-link">
      <li className="card-container" key={id}>
        <div className="company-logo-details-container">
          <div className="company-logo-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
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
        <h1 className="description-heading-1">Description</h1>
        <p className="description-heading">{jobDescription}</p>
      </li>
    </Link>
  )
}
export default JobCard
