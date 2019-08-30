// represent a event in dva model
let uid = 0
export class EventModel {
  constructor (value) {
    this.id = uid++
    this.value = value
  }
  equalsTo (em) {
    return EventModel.equalsTo(this, em)
  }
}

EventModel.equalsTo = (e1, e2) => {
  return !!e2
    ? (e1.id === e2.id && e1.value === e2.value)
    : false
}
