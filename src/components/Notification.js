import React, { useEffect, useState } from 'react';
import { Image } from "react-bootstrap"
import { useNavigate } from 'react-router-dom';
import logoSH from '@images/logoSH.png';
import { MdNotifications, MdNotificationImportant } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import _ from 'lodash'
import loadIcon from '@images/load.gif'
import { getNotificationList, readNotification } from '@/services';
import { removeNotificationData } from '@/reducers/dashboard';

const Notification = (props) => {
   const dispatch = useDispatch()
   const [state, setState] = useState({});
   let {
      isShowNotificationWindow = false,
      today = [],
      yesterday = [],
      older = [],
      isActive = false,
      isProcessing = false,
   } = state;
   const notificationData = useSelector((state) => {
      return {
         totalUnread: state.dashboard.unreadNotifications,
         notificationList: state?.dashboard.unreadNotificationList || state?.dashboard.notificationList,
      }
   })
   const { totalUnread, notificationList } = notificationData

   const [getting, setGetting] = useState(false)
   const {
      isGettingMore = false,
      isGetAll = false,
   } = getting;

   today = _.filter(notificationList, (item) => moment(item?.created_at).format('YYYY/MM/DD') === moment().format('YYYY/MM/DD'))
   yesterday = _.filter(notificationList, (item) => moment(item?.created_at).format('YYYY/MM/DD') === moment().subtract(1, 'days').format('YYYY/MM/DD'))
   older = _.xorBy(notificationList, [...today, ...yesterday], 'created_at')

   useEffect(() => {
      loadMoreNotification();
   }, [isActive])

   const NotificationItem = ({ item }) => {
      let path = getNavigationPath(item?.meta, item?.type);
      const navigate = useNavigate()
      const handleNotificaton = (notificationId, is_read) => {
         navigate(path)
         setState({ ...state, isShowNotificationWindow: false });
         !is_read && dispatch(readNotification({ notificationIds: [notificationId] }));
      }
      return (
         <div className={item?.is_read ? 'notificationItem' : 'notificationItemUnread'}
            onClick={() => handleNotificaton(item?.id, item?.is_read)} role='button'>
            <Image alt='logo' src={item?.ref_user?.image || logoSH} className='avatar3 B-primary' roundedCircle
               style={{ objectFit: item?.ref_user?.image ? 'cover' : 'contain' }}
            />
            <div className='d-flex w-100 justify-content-between align-items-center'>
               <div
                  className={`notificationMessage ${isProcessing ? 'processing' : ''}`}
               >
                  <span className='d-flex ms-2 w-100' style={{ wordBreak: "break-all" }} dangerouslySetInnerHTML={{ __html: item?.message }}></span>
               </div>
               <span className='F-10 C-818188 text-nowrap' style={{ width: '21%' }}>&nbsp;{moment(item?.created_at).fromNow()}</span>
            </div>
            {/* {!item?.is_read ? <span className='me-1 C-primary'><GoPrimitiveDot/></span> : <span className='px-2'></span>} */}
         </div>
      )
   }

   const toggleWindow = () => setState({ ...state, isShowNotificationWindow: !isShowNotificationWindow })

   const handleMarkAll = () => {
      dispatch(readNotification({ all: true }))
   }

   const onScroll = (e) => {
      var element = e.target;
      if (element.scrollHeight < element.scrollTop + element.clientHeight + 3) {
         !isGetAll && !isGettingMore && loadMoreNotification()
      }
   }

   const loadMoreNotification = () => {
      setGetting({ isGettingMore: true, isGetAll })
      let queryParams = {
         limit: 15,
         offset: _.size(notificationList),
         readState: (isActive ? 'unread' : '')
      }
      dispatch(getNotificationList(queryParams)).unwrap().then(res => {
         if (res?.success) {
            setGetting({
               isGettingMore: false,
               isGetAll: _.size(notificationList) === res?.total
            })
         } else setGetting({ ...getting, isGettingMore: false })
      })
   }

   const handleToggle = (checked) => {
      setGetting({ ...getting, isGettingMore: true })
      if (checked) {
         setState({ ...state, isActive: !isActive });
         dispatch(removeNotificationData('unread'));
      } else {
         setState({ ...state, isActive: !isActive });
         dispatch(removeNotificationData('all'));
      }
   }

   const getNavigationPath = (meta, type) => {
      let data = JSON.parse(meta)
      let pathname = '/'
      let tab = 1
      if (type === 'equipment') {
         pathname += type + '/' + data?.equipmentId
         if (data?.inspectionId) tab = 1
         if (data?.accessoryId) tab = 2
         if (data?.userId) tab = 3
         if (data?.activityId) tab = 4
         if (data?.documentId) tab = 5
      }
      else if (type === 'location') {
         pathname += type + 's/' + data?.locationId
         if (data?.userId) tab = 3
         if (data?.equipmentId) tab = 1
         if (data?.activityId) tab = 4
      }
      else if (type === 'user') {
         pathname += 'people/' + data?.userId
         if (data?.locationId) tab = 1
         if (data?.equipmentId) tab = 2
         if (data?.activityId) tab = 3
      }
      else if (type === 'credential') {
         pathname += 'credentials'
         if (data?.credentialId) tab = data?.credentialId
      }
      let to = { pathname, search: `tab=${tab}` }
      return to;
   }
   let switchBtnColor = isActive ? 'Bg-success' : 'Bg-danger'
   return (
      <div className='center w-100 flex-column'>
         <div className='me-4' style={{ cursor: 'pointer' }} onClick={() => toggleWindow()}>
            {totalUnread ? <div className='badge' >{totalUnread}</div> : null}
            <MdNotifications size={24} style={{ transform: 'rotate(40deg)' }} className='C-primary' />
         </div>
         {isShowNotificationWindow &&
            <div className='notificationWindowBackDrop'
               onClick={() => toggleWindow()}>
               <div className='Shadow notificationWindow' onClick={(e) => e.stopPropagation()}>
                  <div className='d-flex F-18 align-items-center justify-content-between p-3 C-dark border-bottom'
                     style={{ height: '5vh' }}>
                     <span>Notifications</span>
                     <span className='F-12 C-818188 d-flex center'>Only show unread &nbsp;
                        <input
                           className="switch"
                           checked={isActive}
                           type="checkbox"
                        />
                        <button
                           onClick={() => handleToggle(!isActive)}
                           className={`switchLabel`}
                           htmlFor={`switch`}
                        >
                           <span className={`switchButton ${switchBtnColor}`} />
                        </button></span>
                  </div>
                  {_.size(notificationList) ?
                     <div className={`Content p-1 pb-3 mb-2 ${isProcessing ? 'processing' : ''}`} style={{ height: '75vh' }} onScroll={onScroll}>
                        <div className='d-flex flex-row justify-content-between mt-2 mb-2'>
                           <span className='C-dark F-14 ms-2'>{_.size(today) ? 'Today' : ''}</span>
                           <div>
                              <button className='markAllBtn' onClick={() => handleMarkAll()}>Mark all as read</button>
                           </div>
                        </div>
                        {
                           today.map((item, index) => <NotificationItem item={item} key={index} />)
                        }
                        <div className='d-flex flex-row justify-content-between mt-2 mb-2'>
                           <span className='C-dark F-14 ms-2'>{_.size(yesterday) ? 'Yesterday' : ''}</span>
                        </div>
                        {
                           yesterday.map((item, index) => <NotificationItem item={item} key={index} />)
                        }
                        <div className='d-flex flex-row justify-content-between mt-2 mb-2'>
                           <span className='C-dark F-14 ms-2'>{_.size(older) ? 'Older' : ''}</span>
                        </div>
                        {
                           older.map((item, index) => <NotificationItem item={item} key={index} />)
                        }
                        {isGettingMore ?
                           <div className='center'>
                              <img src={loadIcon} alt='' style={{ height: '100px', width: '100px', objectFit: 'fill' }} />
                           </div>
                           :
                           <div style={{ height: isGetAll ? '0px' : '100px' }}></div>
                        }
                     </div>
                     : isGettingMore ?
                        <div className='center' style={{ height: '74vh' }}>
                           <img src={loadIcon} alt='' style={{ height: '100px', width: '100px', objectFit: 'fill' }} />
                        </div>
                        :
                        <div className='p-1 center flex-column' style={{ height: '75vh' }} >
                           <MdNotificationImportant className='C-818188' size={100} />
                           <span className='F-16 C-dark'>No Notifications</span>
                        </div>
                  }
               </div>
            </div>
         }
      </div >
   )
}

export default Notification;