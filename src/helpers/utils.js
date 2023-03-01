import _ from 'lodash'
export const getAddress = (address) => {
  let res = {
    name: (address && address.name) || '',
    lat: (address && address.geometry && address.geometry.location).lat() || 0,
    lng: (address && address.geometry && address.geometry.location).lng() || 0,
    address: '',
    city: '',
    state: '',
    state_code: '',
    country: '',
    zipcode: '',
  };

  if (address && address.address_components) {
    for (var i = 0; i < address.address_components.length; i++) {
      for (var j = 0; j < address.address_components[i].types.length; j++) {
        if (address.address_components[i].types[j] === 'street_number') {
          res.address = address.address_components[i].long_name + ' '
        } else if (address.address_components[i].types[j] === 'route') {
          res.address += address.address_components[i].long_name
        } else if (address.address_components[i].types[j] === 'locality') {
          res.city = address.address_components[i].long_name
        } else if (address.address_components[i].types[j] === 'administrative_area_level_1') {
          res.state = address.address_components[i].long_name
          res.state_code = address.address_components[i].short_name
        } else if (address.address_components[i].types[j] === 'country') {
          res.country = address.address_components[i].long_name
        } else if (address.address_components[i].types[j] === 'postal_code') {
          res.zipcode = address.address_components[i].long_name
        }
      }
    }
  }

  return res;
}

export const getEquipmentUsers = (users) => {
  let data = { id: "user_id" }
  let newUsers = users.map((key) => {
     return _.mapKeys(key, (v, keyName) => {
        return keyName in data ? data[keyName] : keyName;
     })
  })
  return newUsers
}

export const getModels = (parentCategories, slug, modelList) => {
  slug = slug?.toLowerCase();
  const parentCategoryId = parentCategories?.find((categ) => categ?.slug === slug)?.id;
  let model = modelList?.filter((model) => +model?.equipment_category?.parent_id === parentCategoryId);
  let brands = model?.map((equipment) => equipment?.equipment_brand);
  brands = _.uniqBy(brands, brand => brand?.id);
  return {model, brands}
}