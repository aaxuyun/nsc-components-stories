export const hasPermission = (permissionsRequired, permissionsGranted) => {
  permissionsRequired = typeof permissionsRequired === 'string' ? [permissionsRequired] : permissionsRequired
  permissionsGranted = typeof permissionsGranted === 'string' ? [permissionsGranted] : permissionsGranted
  
  if (permissionsGranted.includes('*') || permissionsRequired.length === 0) {
    return true
  } else {
    return permissionsRequired.filter(p => permissionsGranted.includes(p)).length === permissionsRequired.length
  }
}