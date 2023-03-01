// import classLink from '@images/classLink.png'
import MS from '@images/MS.png'
import apple from '@images/apple.png'
import google from '@images/google.png'
// import clever from '@images/clever.png';
const SocialIcons = () => {
  return (
    <div className="d-flex justify-content-evenly p-0 m-0">
      <a href={process.env.REACT_APP_SOCIAL_URL + 'auth/microsoft/redirect'} >
        <img alt="MS" src={MS} />
      </a>
      <a href={process.env.REACT_APP_SOCIAL_URL + 'auth/apple/redirect'} >
        <img alt="Apple" src={apple} />
      </a>
      {/* <a href={process.env.REACT_APP_SOCIAL_URL + 'auth/clever/redirect'} >
        <img alt="" src={clever} />
      </a> */}
      <a href={process.env.REACT_APP_SOCIAL_URL + 'auth/google/redirect'} >
        <img alt="google" src={google} />
      </a>
      {/* <a href="https://classlink.com/" >
        <img alt="" src={classLink} />
      </a> */}
    </div>
  )
}
export default SocialIcons;