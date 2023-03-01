import notfound from '@images/404.gif';
const NotFound = () => {
    return (
        <div
            className='center Bg-fff w-100'
            style={{
                position: 'absolute',
                height: window.innerHeight,
                zIndex: '8 !important'
            }}
        >
            <img
                src={notfound}
                className='h-100 -100 bg-warning'
                alt='Page Not Found!'
            />
        </div>
    )
}
export default NotFound;