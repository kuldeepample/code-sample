import Inspections from '@/pages/equipment/equipmentDetail/inspections'
import React from 'react'

const Inspection = (props) => {
  const {data} = props;

  return (
    <>
      <Inspections data = {data} medication />
    </>
  )
}

export default Inspection