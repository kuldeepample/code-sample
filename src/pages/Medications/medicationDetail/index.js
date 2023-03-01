import { EmptyComponent } from '@/components/common';
import AddressBar from '@/components/Layout/AddressBar';
import EquipmentHeader from '@/pages/equipment/equipmentDetail/EquipmentHeader';
import React, { useState } from 'react'
import { useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { connect, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import TabView from './TabView';
import { pusher } from "@/helpers";
import { getEquipmentDetail } from '@/services';
import { updateEquipmentDetail } from '@/reducers/equipment';

const MedicationDetail = (props) => {
  const dispatch = useDispatch()
  const params = useParams();
  const [state, setState] = useState({});
  let { loading = false, medicationDetail } = state;
  const navigate = useNavigate()

  useEffect(() => {
    if (params?.medicationId) {
       setState({ ...state, loading: true })
       dispatch(getEquipmentDetail(params?.medicationId)).unwrap().then((res) => {
          if (res?.success) {
            if(res?.data?.equipment_model?.equipment_category?.parent?.slug === 'equipment'){
                navigate({pathname: `/equipment/${params?.medicationId}`})
            } else
             setState({...state, medicationDetail: res, loading: false });
          }
          else setState({ ...state, loading: false })
       });
    }
 }, [params.medicationId])

 useEffect(() => {
  const channel = pusher.subscribe('compliance');
  channel.bind("status", function (data) {
     if (data?.equipment?.id === +params?.medicationId)
        dispatch(updateEquipmentDetail(data));
  });

  return (() => {
     channel.unbind();
  })
}, [])


  return (
    <div className='d-flex flex-column' style={{ flex: '1' }}>
      <AddressBar page={[{ name: 'Medication', link: '/medication' }]} />
      {
        loading ?
          <div style={{ zIndex: 1, opacity: 0.8, flex: '1' }} className='center'>
            <Spinner animation='border' />
          </div>
          :
          medicationDetail ?
            <>
              <EquipmentHeader data={props.data} serviceName={"Inspection"} />
              {/* <TabView data={props.equipmentDetail} callGetEquipmentDetail={() => setCallApi(!callApi)} isService={isService} /> */}
              <TabView data={props.data}/>
            </>
            :
            <EmptyComponent title='Equipment' />
      }
    </div>
  )
}
const mapStateToProps = state => {
    return {
      data: state.equipment.equipmentDetail
    }
}
const actionCreators= {
  // getEquipmentDetail: (data) => (dispatch) => dispatch(getEquipmentDetail(data)),
  // updateEquipmentDetail: (data) => (dispatch) => dispatch(updateEquipmentDetail(data)),

}
export default connect(mapStateToProps, actionCreators)(MedicationDetail);