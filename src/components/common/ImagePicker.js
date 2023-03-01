import React from "react";
import { ProgressBar } from "react-bootstrap";
import user from '@images/avatar1.png'
const ImagePicker = (props) => {
	const { image, states, onChangeFile } = props
	return (
		<div className='flex-column center mt-2'>
			<input
				id="img"
				type="file"
				accept="image/*"
				capture="camera"
				style={{ display: 'none' }}
				onChange={onChangeFile}
			/>
			<div className={'border border-secondary center'}
				style={{ height: '90px', width: '90px', borderRadius: '6px', overflow: 'hidden' }}
			>
				{!states?.loading ?
					<img src={image || user} alt='User icon' className='w-100 h-100' />
					:
					<div className='center flex-column' style={{ width: '90%' }}>
						<p className='h5 C-link'>{states?.progress} %</p>
						<ProgressBar animated now={states?.progress} style={{ height: '8px', borderColor: '#586ed4' }} className='w-100 border-2 B-primary Shadow' />
					</div>
				}
			</div>
			<label htmlFor="img" role={'button'}
				style={{ color: '#586ed4', fontSize: '12px' }}
				className='itemText mt-2'
			>Upload Image</label>
		</div>
	);
}

export default ImagePicker;
