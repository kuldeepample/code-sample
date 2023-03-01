import X from '@images/closeButton.png'
const CloseButton = ({ onClose }) => {
    return (
        <button
            className='rounded-circle border-0 center Bg-primary C-fff p-0 m-0'
            style={{ height: '22px', minWidth: '22px', width: '22px' }}
            onClick={onClose}
        >
            <img
                src={X}
                alt='Close'
                className='w-100 h-100'
            />
        </button>
    )
}
export default CloseButton;