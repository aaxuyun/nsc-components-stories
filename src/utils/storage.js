export const set = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj))
}

export const get = key => {
  try {
    const obj = JSON.parse(localStorage.getItem(key))
    return obj
  } catch (e) {
    return null
  }
}
