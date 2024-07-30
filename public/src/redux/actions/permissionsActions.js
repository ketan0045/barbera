export const getOperatorPermissionsId = () => {
  return{
    type: 'GET_OPERATOR_PERMISSIONS_ID'
  }
}

export const setOperatorPermissionsId = (operatorId) => {
  return{
    type: 'SET_OPERATOR_PERMISSIONS_ID',
    payload: operatorId
  }
}

export const getOperatorPermissions = () => {
  return{
    type: 'GET_OPERATOR_PERMISSIONS'
  }
}

export const setOperatorPermissions = (permissionsArray) => {
  return{
    type: 'SET_OPERATOR_PERMISSIONS',
    payload: permissionsArray
  }
}

export const getStaffPermissionsId = () => {
  return{
    type: 'GET_STAFF_PERMISSIONS_ID'
  }
}

export const setStaffPermissionsId = (staffId) => {
  return{
    type: 'SET_STAFF_PERMISSIONS_ID',
    payload: staffId
  }
}

export const getStaffPermissions = () => {
  return{
    type: 'GET_STAFF_PERMISSIONS'
  }
}

export const setStaffPermissions = (permissionsArray) => {
  return{
    type: 'SET_STAFF_PERMISSIONS',
    payload: permissionsArray
  }
}