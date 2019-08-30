import { createElement } from 'react'
import { ableToAccess, ableToAccessByAnyObject } from './utils'

/**
 * access control of UI element
 *
 * usage:
 *    <AccessController condition={{ dept: { $in: ['d1', 'd2'] } }} component={BusinessComponent} {...props} />
 */

export default props => {
  const {
    component,
    condition,
    target,
    children,
    ...restProps
  } = props

  if (condition === true) {
    return createElement(component, restProps, children)
  } else if (!target) {
    // test by user
    return ableToAccess(condition) ? createElement(component, restProps, children) : null
  } else {
    // test by any object as target
    return ableToAccessByAnyObject(condition, target) ? createElement(component, restProps, children) : null
  }
}
