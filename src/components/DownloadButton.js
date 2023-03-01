import download from '@images/downloadfff.png';
const DownloadButton = ({ file }) => {

   return (
      <a
         href={file}
         download={file}
         target='_blank'
         rel="noreferrer"
         className='Bg-primary p-1 ms-1 border-0 rounded-circle d-flex align-items-center justify-content-center'
         style={{ height: '30px', minWidth: '30px', opacity: file ? 1 : 0.6 }}
      >
         <img src={download} alt='download' className='w-75 h-75' />
      </a>

   )
}
export default DownloadButton;