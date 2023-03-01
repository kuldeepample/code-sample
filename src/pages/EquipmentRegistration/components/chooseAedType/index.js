import { useEffect, useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import _ from 'lodash'
import Gallary from './Gallary'
import Footer from '../../Footer'
import DropDown from '@components/common/DropDown'

import { toast } from 'react-toastify';
import { connect, useDispatch, useSelector } from 'react-redux'
import { getEquipmentCategoriesList, getEquipmentModelList } from '@/services'

const ChooseAEDType = (props) => {
   const dispatch = useDispatch()
   const [equipmentModels, setEquipmentModels] = useState([]);
   const [brandList, setBrandList] = useState([]);
   const [loading, setLoading] = useState(false)

   const reducerData = useSelector((state) => {
      return {
         equipmentModelList: state.equipment.equipmentModelList,
         equipmentCategories: state.equipment.equipmentCategories
      }
   })
   const { equipmentModelList, equipmentCategories } = reducerData
   const { active, state, handleChange, goBack, goForward, id, slug } = props;

   useEffect(() => {
      if (_.isEmpty(equipmentCategories)) {
         dispatch(getEquipmentCategoriesList());
      } else
         getModels()

   }, [equipmentCategories])

   const getModels = () => {
      let equipmentCategory = equipmentCategories?.find((category) => category.slug === slug);

      let params = {
         equipment_category_id: equipmentCategory?.id
      }
      setLoading(true)
      dispatch(getEquipmentModelList(params)).unwrap().then((res) => {
         if (res?.success) {
            setEquipmentModels(res?.data);
            let brands = res?.data?.map((equipment) => equipment?.equipment_brand);
            brands = _.uniqBy(brands, brand => brand?.id);
            setBrandList(brands)
            setLoading(false)
         }
         else
            setLoading(false);
      })
   }
   const getModelList = (brandId) => {
      if (brandId) {
         let filteredModels = _.filter(equipmentModelList, (model) => { return model?.equipment_brand?.id === brandId })
         setEquipmentModels(filteredModels)
      } else setEquipmentModels(equipmentModelList)
   }

   const handleSelection = (brand) => {
      getModelList(brand.id);
      handleChange('aed', { equipment_brand: brand })
   }

   const handleForward = () => {
      if (state?.aed?.id) {
         goForward(id)
      }
      else
         toast.warn("Please select Equipment !")
   }


   return (
      <div className='h-100 d-flex flex-column justify-content-between pb-3'
         style={{ minHeight: window.innerHeight - 230 }}
      >
         <div>
            <div className='Bg-light C-primary bold ps-4 d-flex align-items-center '>Choose {_.startCase(slug)} Type</div>
            <Row className='d-flex flex-row p-1 m-2 justify-content-center' >
               <Col lg={3} md={4} >
                  <DropDown
                     placeholder='Brand'
                     value={state?.aed?.equipment_brand?.name}
                     classes={state?.aed?.equipment_brand?.name ? 'C-primary bold mb-2' : 'mb-2'}
                     data={brandList}
                     onChange={(e) => handleSelection(JSON.parse(e.target.id))}
                  />
               </Col>
               <Col lg={3} md={4}>
                  <DropDown
                     placeholder='Model'
                     value={state?.aed?.name}
                     data={state?.aed?.equipment_brand?.id && equipmentModels}
                     classes={state?.aed?.name ? 'C-primary bold mb-2' : 'mb-2'}
                     onChange={(e) => handleChange('aed', JSON.parse(e.target.id))}
                  />
               </Col>
            </Row>
            <div className='d-flex flex-column border border-2 rounded Content m-3 mt-2 justify-content-center'
               style={{ height: window.innerHeight - 400, minHeight: '280px', maxHeight: window.innerHeight }}
            >
               {
                  loading ?
                     <Spinner animation='border' className='d-flex align-self-center align-items-center' />
                     :
                     <Gallary handleChange={handleChange} equipmentModels={equipmentModels} state={state} />
               }
            </div>
         </div>
         <Footer active={active} goBack={() => goBack()} goForward={() => handleForward()} />
      </div>
   )
}
const mapStateToProps = (state) => {

}

const actionCreators = {
   // getEquipmentModelList: (data) => (dispatch) => dispatch(getEquipmentModelList(data)),
   // getEquipmentCategoriesList: () => (dispatch) => dispatch(getEquipmentCategoriesList())
}

export default connect(mapStateToProps, actionCreators)(ChooseAEDType);