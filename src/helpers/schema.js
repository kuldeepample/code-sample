export const userSchema = {
  fname: '',
  lname: '',
  email: '',
  mobile: '',
  gender: '',
  image: '',
  user_type_id: '',
  status: 'active',
}

export const locationSchema = {
  id: '',
  name: '',
  address: '',
  address2: '',
  city: '',
  state: '',
  state_code: '',
  country: '',
  zip: '',
  lat: '',
  lng: '',
  mobile: '',
  status: 'active',
}

export const locationPeopleSchema = {
  id: '',
  location_id: '',
  user_id: '',
  status: 'active',
}

export const dashboardSchema = {
  location: {
    totalCompliant: 0,
    totalPending: 0,
    totalNonCompliant: 0,
    totalCount: 0,
  },
  equipment: {
    totalDanger: 0,
    totalInfo: 0,
    totalWarning: 0,
    totalCount: 0,
  }
}