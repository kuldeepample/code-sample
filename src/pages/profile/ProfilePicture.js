import { Image, ProgressBar } from 'react-bootstrap'
import avatar from '@images/avatar1.png'
import { AiFillCamera } from 'react-icons/ai';

const ProfilePicture = (props) => {
   let { image, loading, handleProfilePic, progress = 0 } = props;
   return (
      <div className='d-flex profilePictureContainer center align-items-center mt-2 Shadow'>
         {!loading ?
            <>
               <Image src={image || avatar} alt='Profile-Picture' className='profilePicture' />
               <div className='editProfile-btn center' >
                  <input type={'file'} accept='image/*' style={{ width: '100%', opacity: '0', position: 'absolute' }} role={'button'} onChange={(e) => handleProfilePic(e)}/>
                  <AiFillCamera color='#fff' size={18} />
               </div>
            </>
            :
            // <Spinner animation='grow' className='d-flex C-primary' />
            <div className='center flex-column' style={{ width: '90%' }}>
               <p className='h2 text-info'>{progress} %</p>
               <ProgressBar animated now={progress} variant='info' className='w-100 border-2 B-primary border-info Shadow' label={`${progress} %`} />
            </div>
         }
      </div>
   )
}

export default ProfilePicture;