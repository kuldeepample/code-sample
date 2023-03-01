

import editIcon from '@images/edit.png'
import infoIcon from '@images/info.png'
import trashIcon from '@images/trash.png'
import viewIcon from '@images/eye00f.png'
import exportIcon from '@images/export.png'
import downloadIcon from '@images/download00f.png'
import logInspection from '@images/logInspection.png'
import logActivity from '@images/logActivity.png'
import Accept from '@images/check.png'
import Cross from '@images/cross.png'
import deletes from '@images/delete.png'
import { Image, Overlay, OverlayTrigger, Popover } from 'react-bootstrap'

const ToolTip = (props) => {
	let { show,
		setShow,
		options = [],
		// onHide
	} = props
	const getImage = (name) => {
		if (name === 'Edit') return editIcon
		if (name === 'View') return viewIcon
		if (name === 'Detail') return infoIcon
		if (name === 'Remove') return trashIcon
		if (name === 'Export') return exportIcon
		if (name === 'Download') return downloadIcon
		if (name === 'Log Activity') return logActivity
		if (name === 'Approve') return Accept
		if (name === 'Remove ') return deletes
		if (name === 'Reject') return Cross
		if (name === 'Log Inspection' || name === 'Log Service') return logInspection
	}
	return (
		<OverlayTrigger
			trigger='click'
			as={Overlay}
			key={'placement'}
			placement={'bottom'}
			show={show}
			// onHide={onHide}
			rootClose
			overlay={
				<Popover id={`popover-positioned-bottom`}>
					<Popover.Body className='p-2 d-flex flex-column align-items-start'>
						{
							options.map((option, index) => {
								return (
									<a className='border-0 Bg-fff linkText' href={option.fileUrl} onClick={option.onClick} role='button' download target="_blank" rel="noreferrer">
										{index ? <hr className='mt-1 mb-1' /> : null}
										{getImage(option.name) && 
										<Image src={getImage(option.name)} alt='Icon' className='editIcon' />
										}
										<strong className='C-link'> {option.name}</strong>
									</a>
								)
							})
						}

					</Popover.Body>
				</Popover>
			}
		>
			<button
				className='edit-btn C-primary rounded-circle toolTip center'
				style={{ transform: 'rotate(90deg)' }}
				onClick={setShow}
				disabled={options?.length > 0 ? false : true}
			>•••</button>
		</OverlayTrigger>
	)
}
export default ToolTip;