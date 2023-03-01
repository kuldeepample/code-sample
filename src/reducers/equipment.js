import _ from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { getAccessoriesList, getAvailableEquipments, getDocumentList, getEquipmentBrandList, getEquipmentCategoriesList, getEquipmentDetail, getEquipmentList, getEquipmentModelList, getEquipmentPeopleList, getIncidentList, getInspectionList, getLocationEquipment, getModelAccessoriesList } from '@/services/equipment.services';

const initialState = {
   equipmentList: null,
   locationEquipmentList: [],
   availableEquipmentList: null,
   equipmentDetail: {},
   equipmentCategories: null,
   inspectionList: null,
   documentList: null,
   accessoriesList: null,
   equipmentPeople: null,
   modelAccessories: null,
   incidentList: null,
   equipmentBrandList: null,
   equipmentModelList: null,
   parentCategories: [],
   loading: true,
   reportCategories: []
}

const equipment = createSlice({
   name: 'equipment',
   initialState,
   reducers: {
      updateEquipmentDetail: (state, action) => {
         state.equipmentDetail = { ...state?.equipmentDetail, ...action.payload?.equipment }
      }
   },
   extraReducers: {
      [getEquipmentList.fulfilled]: (state, action) => {
         state.equipmentList = action?.payload?.data
      },
      [getLocationEquipment.fulfilled]: (state, action) => {
         state.locationEquipmentList = action?.payload?.data
      },
      [getAvailableEquipments.fulfilled]: (state, action) => {
         state.availableEquipmentList = action?.payload?.data
      },
      [getEquipmentDetail.fulfilled]: (state, action) => {
         state.equipmentDetail = action.payload?.data
      },
      [getEquipmentCategoriesList.fulfilled]: (state, action) => {
         const parentCategoriesList = action?.payload?.data?.flatMap((category) => !category?.parent_id ? category : []);
         const parentCategories = parentCategoriesList?.map((category) => category?.slug)
         const reportCateg = ['equipment', 'medication']
         const reportCategories = parentCategoriesList?.filter((item) => reportCateg?.includes(item.slug))
         return {
            ...state,
            equipmentCategories: action?.payload?.data,
            loading: false,
            parentCategories,
            parentCategoriesList,
            reportCategories
         };
      },
      [getModelAccessoriesList.fulfilled]: (state, action) => {
         state.modelAccessories = action.payload?.data
      },
      [getInspectionList.fulfilled]: (state, action) => {
         state.inspectionList = action.payload?.data
      },
      [getDocumentList.fulfilled]: (state, action) => {
         state.documentList = action.payload?.data
      },
      [getAccessoriesList.fulfilled]: (state, action) => {
         let data = action.payload?.data
         let newData = []
         _.map(data, (a) => { newData.push({ ...a, 'icon': a?.equipment_model_accessory?.accessory_type?.icon, 'name' : a?.equipment_model_accessory?.name }) });
         return {
            ...state,
            accessoriesList: newData
         }
      },
      [getEquipmentPeopleList.fulfilled]: (state, action) => {
         state.equipmentPeople = action.payload?.data
      },
      [getIncidentList.fulfilled]: (state, action) => {
         state.incidentList = action.payload?.data
      },
      [getEquipmentBrandList.fulfilled]: (state, action) => {
         state.equipmentBrandList = action.payload?.data
      },
      [getEquipmentModelList.fulfilled]: (state, action) => {
         state.equipmentModelList = action?.payload?.data
      },

   }
})

export const { updateEquipmentDetail } = equipment.actions
export default equipment.reducer;