// Meryem Esma Eröz, 2200005798
// Destructuring in parameters and loops (forms 11 and 12). Run with `node js/params.mjs`.
// My data: a small study timer and my weekly schedule.

// Form 11: an options object in the parameter list, with defaults.
function startTimer({ subject, minutes = 25, breakMinutes = 5 } = {}) {
  return `${subject ?? 'nothing'}: ${minutes} min work, ${breakMinutes} min break`
}
console.log('form 11:', startTimer({ subject: 'Calculus', minutes: 50 }))
console.log('form 11 (no argument):', startTimer())
console.log('form 11 (null minutes):', startTimer({ subject: 'OOP', minutes: null }))
// what the pattern means, written as plain lines:
function startTimerPlain(options) {
  if (options === undefined) options = {}
  let minutes = options.minutes
  if (minutes === undefined) minutes = 25
  return minutes
}
console.log('form 11 (plain):', startTimerPlain())
// without "= {}" the call with no argument crashes
function startTimerNoDefault({ subject }) {
  return subject
}
try {
  startTimerNoDefault()
} catch (error) {
  console.log('form 11 (no = {}):', error.message)
}

// Form 11b: the same idea with an array parameter, ([x, y]) => ...
const toMinutes = ([hours, minutes = 0]) => hours * 60 + minutes
console.log('form 11b:', toMinutes([1, 30]), toMinutes([2]))

// Form 12: loops over entries
const hoursPerCourse = { Calculus: 4, OOP: 3, 'Web Programming': 3 }
for (const [course, hours] of Object.entries(hoursPerCourse)) {
  console.log('form 12 (object):', course, hours)
}
const roomOf = new Map([
  ['Monday', 'A-204'],
  ['Wednesday', 'Lab 3'],
])
for (const [day, room] of roomOf) {
  console.log('form 12 (Map):', day, room)
}
// an array of objects with an object pattern in the loop and in .map
const sessions = [
  { course: 'OOP', day: 'Monday' },
  { course: 'Calculus', day: 'Tuesday' },
]
for (const { course, day } of sessions) console.log('form 12 (objects):', day, course)
console.log('form 12 (map):', sessions.map(({ course }) => course))
// entries() of an array gives [index, value] pairs
for (const [i, { course }] of sessions.entries()) console.log('form 12 (index):', i, course)
