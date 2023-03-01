import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import TextInput from './TextInput';
import _ from 'lodash'
const DropDown = (props) => {
    const [state, setState] = useState({})
    let { value,
        name,
        placeholder,
        onChange,
        emptySelect = true,
        searchable = false,
        disabled = false,
        data, classes, style, lable, lableClass, as,
        validationText, validationTextClass, mainViewClass,
        noShadow, valueClass, callList } = props
    const {
        searchText = '',
        listData = data,
        inputTxt                //show input text when data filter through api
    } = state;

    const onChangeText = (txt) => {
        let dd = data.filter((item) => item.name ? item.name.toLowerCase().includes(txt.toLowerCase()) : (item.fname + ' ' + item.lname).toLowerCase().includes(txt.toLowerCase()))
        if (callList) {
            setState({ ...state, inputTxt: txt })
            callList(txt)
        } else
            setState({ searchText: txt, listData: dd })
    }
    const onClick = (e) => {
        setState({ listData: data, searchText: '' })
        onChange(e);
    }

    return (
        <Dropdown as={as} className={mainViewClass} title={placeholder}>
            <Dropdown.ItemText className={`bold lable C-dark mt-1 ${lableClass}`} style={{ display: lable ? '' : 'none' }} >{lable}</Dropdown.ItemText>
            <Dropdown.Toggle
                disabled={disabled}
                className={`${classes} ${noShadow ? '' : 'Shadow'} dropDown dropDownToggle`}
                style={style}
                variant='light'
            ><p className={`text-truncate ${valueClass}`} style={{ width: '100%', textAlign: 'left' }}>{value || placeholder}</p> &nbsp; &nbsp;
            </Dropdown.Toggle>
            <Dropdown.Menu
                className={`w-100 ${_.size(listData) <= 7 ? 'hide-scroll-bar' : ''}`}
                style={{ maxHeight: '300px', overflowY: 'scroll' }}>
                {searchable && <>
                    <TextInput
                        autoFocus={true}
                        placeholder='Search...'
                        value={searchText || inputTxt}
                        classes='location-search'
                        onChange={(e) => onChangeText(e.target.value)}
                    />
                    <Dropdown.Divider />
                </>}
                {emptySelect && <Dropdown.Item id={JSON.stringify({})} name={name} onClick={e => onClick(e)} className='C-818188' >- - - Select - - -</Dropdown.Item>}
                {_.isArray(listData) &&
                    (searchText ? listData : data)?.map((item, id) => {
                        let isDisable = (typeof item?.canCreate === 'boolean') ? !item?.canCreate : ''
                        if (_.isObject(item))
                            return (
                                <Dropdown.Item disabled={isDisable} key={id} id={JSON.stringify(item)} name={name} onClick={e => onClick(e)} >{item?.name || (item?.fname + ' ' + item.lname)}</Dropdown.Item>
                            )
                        else
                            return (
                                <Dropdown.Item key={id} id={item} name={name} onClick={e => onClick(e)} >{item}</Dropdown.Item>
                            )
                    })
                }
            </Dropdown.Menu>
            {validationText && <Dropdown.ItemText className={`text-danger ps-0 ${validationTextClass}`} style={{ fontSize: '12px' }}>{validationText}</Dropdown.ItemText>}
        </Dropdown>
    )
}
export default DropDown;

// import { useState } from 'react';
// import { Dropdown } from 'react-bootstrap';
// import _ from 'lodash'

// const DropDown = (props) => {
//     const [state, setState] = useState({})
//     let { value, name, placeholder, onChange, data, classes, style, label, labelClass, as, searchable } = props
//     const {
//         searchText = '',
//         listData = data,
//     } = state;
//     const onChangeText = (txt) => {
//         let dd = data.filter((item) => item.label.toLowerCase().includes(txt.toLowerCase()))
//         setState({ searchText: txt, listData: dd })
//     }

//     const onCross = (a) => {
//         onChange(a)
//     }

//     return (
//         <div className='d-flex flex-row align-items-center'>
//             <Dropdown as={as} className={'w-100 d-flex align-items-center h-100'}>
//                 <Dropdown.ItemText className={`bold label C-dark mt-1 ${labelClass}`} style={{ display: label ? '' : 'none' }} >{label}</Dropdown.ItemText>
//                 <Dropdown.Toggle
//                     className={`${classes} dropDownToggle p-0 m-0`}
//                     style={style}
//                     variant='light'
//                 >
//                     <p className='text-truncate' style={{ width: '100%', textAlign: 'left', margin: '0px' }}>{value || placeholder}</p> &nbsp; &nbsp;

//                 </Dropdown.Toggle>
//                 <button
//                     className='rounded-circle border-0 align-items-center justify-content-center p-0 m-0'
//                     style={{
//                         height: '22px', minWidth: '22px', width: '22px', position: 'absolute', zIndex: 3,
//                         right: 30,
//                         display: value === '' || value === undefined ? 'none' : 'block'
//                     }}
//                     onClick={(e) => onClick({ target: { id: `{}`, name } })}
//                 >X </button>

//                 <Dropdown.Menu
//                     className={`w-100 ${_.size(listData) <= 7 ? 'hide-scroll-bar' : ''}`}
//                     style={{ maxHeight: '300px', overflowY: 'scroll' }}>
//                     {searchable && <>
//                         <input
//                             autoFocus={true}
//                             placeholder='Search...'
//                             value={searchText}
//                             className='searchBox'
//                             onChange={(e) => onChangeText(e.target.value)}
//                         />
//                         <Dropdown.Divider />
//                     </>}
//                     {
//                         (listData || []).map((item, id) => {
//                             return (
//                                 <Dropdown.Item key={id}
//                                     id={JSON.stringify(item)}
//                                     name={name}
//                                     onClick={(e) => {
//                                         setState({ listData: data, searchText: '' })
//                                         onChange(e);
//                                     }}
//                                 >{item.label}
//                                 </Dropdown.Item>
//                             )
//                         })
//                     }
//                 </Dropdown.Menu>
//             </Dropdown>

//         </div>
//     )
// }
// export default DropDown;