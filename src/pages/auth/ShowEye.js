import { BsFillEyeSlashFill, BsFillEyeFill } from 'react-icons/bs';

const ShowEye = ({
	show,
	onClick,
	style
}) => {
	return (
		<div>
			<span
				onClick={onClick}
				class="eye-icon border-0 p-0 text-end"
				style={style}
			>
				{
					show
						? <BsFillEyeFill color='#888888' />
						: <BsFillEyeSlashFill color='#888888' />
				}
			</span>
		</div>
	)
}
export default ShowEye;