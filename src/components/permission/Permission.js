import { hasPermission } from '../../utils/permission'
/**
 * simple mode, if has no permissions, it will render null
 * 
 * <Permission required={[]} granted={[*]}>
 *   <MyProtectedButton />
 * </Permission>
 * 
 * 
 * advance mode, you can control your children component based on hasPermission value
 * 
 * <Permission required={[]} granted={[*]} mode="advance">
 *  {hasPermission => <MyProtectedButton disabled={!hasPermission} />}
 * </Permission>
 */

export default ({
  children,
  required = [],  // permission codes that required to access
  granted = [],   // permission codes that granted to the user
  mode = 'simple' // simple or advance
}) => {
  const ableToAccess = hasPermission(required, granted)

  if (mode === 'advance') {
    return children(ableToAccess)
  } else {
    return ableToAccess ? children : null
  }
}