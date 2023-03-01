import React from 'react';
import ActivityComp from '@pages/equipment/equipmentDetail/activity';

const Activity = (props) => {
  return (
  <>
    <ActivityComp data={props.data}/>
  </>
  )
}

export default Activity;