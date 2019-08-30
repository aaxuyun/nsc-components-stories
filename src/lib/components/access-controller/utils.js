import { isString, isNumber, isFunction, isBoolean, intersection } from 'lodash'
import * as action from '@/action'

/**
 *
 * To tell is a given user is able to access by the given conditions
 *
 * rule:
 *  { fieldName: <expression> }
 *  { fieldName: 'simple value '}
 *  { fieldName: function () { function to return expression } }
 *
 * expression:
 *  { <operator>: value }
 *
 * $and | $or
 *  $or:  [ <rule>, <rule>, ... ]
 *  $and: [ <rule>, <rule>, ... ]
 *
 *
 * simple condition:
 *  { dept: { $in: ['', ''] } }
 *  { dept: { $eq: ''} }
 *  { dept: { $in: [''] }, gender: { $eq: '' } } // dept && gender
 *
 * complex condition:
 *  {
 *    $or: [
 *      { dept: {} },
 *      { gender: {} }
 *    ]
 *  }
 *
 * operators:
 *    $in     in []
 *    $nin    not in []
 *    $eq     equal '', only for String and Number
 *    $ne     not equal '', only for String and Number
 *    $has    [] has a value
 *    $and
 *    $or
 *
 * Example:
 *  ableToAccess({ 'details.role': {$eq: 'R01001' }})
 *
 * @param  {Object} [condition={}]
 * @param  {Object|null} obj
 * @return {Boolean}
 */
export const ableToAccessByAnyObject = (condition = {}, obj) => {
  if (!obj) {
    return false
  }
  /* for now, only take flat object into consideration */

  // like: { dept: {}, gender: {} }
  const attrs = Object.keys(condition)

  for (let i = 0; i < attrs.length; i++) {
    const value = evalPath(obj, attrs[i])    // obj.dept.xx.xx
    let expression = condition[attrs[i]]    // condition.dept

    // execute the function first
    if (isFunction(expression)) {
      expression = expression()
    }

    // quick tell for simple value
    if (isString(expression) || isNumber(expression) || isBoolean(expression)) {
      return expression === value
    }

    if (!evalExpression(value, expression)) {
      return false
    }
  }

  return true
}
window.ableToAccessByAnyObject = ableToAccessByAnyObject
/**
 * @param  {Object} [condition={}]
 * @param  {Object|null} user
 * @return {Boolean}
 */
export const ableToAccess = (condition = {}, user) => {
  if (!user) {
    user = action.getUser()
  }

  // always allow to access for admin user
  if (action.isAdminUser()) {
    return true
  }

  return ableToAccessByAnyObject(condition, user)
}


/**
 * a help function
 */
export const accessFilter = ({ condition }) => condition ? ableToAccess(condition) : true

/**
 * allowed operators
 */
const OPERATORS = {
  // $in(1, [1, 2]) === true
  // $in(3, [1, 2]) === false
  // $in([1, 2], [1, 2, 3]) === true
  $in: (value, array) => Array.isArray(value) ? intersection(array, value).length === value.length : array.includes(value),
  $ni: (value, array) => !array.includes(value),
  $eq: (v1, v2) => v1 === v2,
  $ne: (v1, v2) => v1 !== v2,
  // $has([1, 2], 2) === true
  // $has([1, 2, 3], [1, 3]) === true
  // $has([1, 2], [1, 3]) === false
  // $has('1|2', '2')
  $has: (v1, v2) => {
    if (Array.isArray(v1) && Array.isArray(v2) ) {
      return intersection(v1, v2).length === v2.length
    } else {
      return v1.includes(v2)
    }
  },
  // $anyIn([1, 2], [2, 3]) === true
  // $anyIn([1, 2], [3, 4]) === false
  $anyIn: (array1, array2) => intersection(array1, array2).length > 0
}

/**
 * evaluate result of expression
 * any operation returns false, will return false, otherwise return true
 *
 * @param  {Any}     value
 * @param  {Object}  expression   { $in: ['1', '2'], $ni: [] }
 * @return {Boolean}
 */
const evalExpression = (value, expression) => {
  const operators = Object.keys(expression)

  for (let i = 0; i < operators.length; i++) {
    const operator = operators[i]         // $in
    const operant = expression[operator]  // ['1', '2']
    const operation = OPERATORS[operator]

    if (!operation) {
      console.warn(`evalExpression() operator ${operator} is unknown`, expression)
      break
    }

    if (!operation(value, operant)) {
      return false
    }
  }
  return true
}

/**
 * evaluate value of path of a given Object
 * non-exist path will return null
 *
 * usage:
 *  evalPath({ a: { b: { c: 1 } } }, 'a.b') => { c: 1 }
 *
 * @param  {Object} obj
 * @param  {String} path
 * @return {Any}
 */
const evalPath = (obj, path) => {
  const getter = new Function('scope', `return scope.${path}`)
  try {
    return getter(obj)
  } catch (e) {
    return null
  }
}
