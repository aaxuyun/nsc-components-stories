import moment from 'moment'

export const datetimeFormat = v => {
  if (!v) {
    v = ''
  }

  if (typeof v === 'string') {
    v = new Date(v)
  }

  if (v.toString() === 'Invalid Date') {
    return ''
  } else {
    return moment(v).format('YYYY-MM-DD HH:mm:ss')
  }
}
