// Meryem Esma Eröz, 2200005798
// Forms 11 and 12 in TypeScript, and the typing rules for patterns in parameters.

type TimerOptions = { subject?: string; minutes?: number; breakMinutes?: number }

// Form 11: the type goes after the WHOLE pattern, the default object after the type.
function startTimer({ subject = 'nothing', minutes = 25, breakMinutes = 5 }: TimerOptions = {}): string {
  // inside: subject: string, minutes: number (defaults removed undefined)
  return `${subject}: ${minutes} min work, ${breakMinutes} min break`
}
console.log('form 11:', startTimer({ subject: 'Calculus', minutes: 50 }))
console.log('form 11 (no argument):', startTimer())

// Form 11b: a tuple parameter
const toMinutes = ([hours, minutes = 0]: [number, number?]): number => hours * 60 + minutes
console.log('form 11b:', toMinutes([1, 30]), toMinutes([2]))

// Form 12: loops over entries
const hoursPerCourse: Record<string, number> = { Calculus: 4, OOP: 3, 'Web Programming': 3 }
for (const [course, hours] of Object.entries(hoursPerCourse)) {
  // course: string, hours: number
  console.log('form 12 (object):', course, hours * 2, 'hours of study')
}
const roomOf = new Map<string, string>([
  ['Monday', 'A-204'],
  ['Wednesday', 'Lab 3'],
])
for (const [day, room] of roomOf) {
  console.log('form 12 (Map):', day.slice(0, 3), room)
}
type Session = { course: string; day: string }
const sessions: Session[] = [
  { course: 'OOP', day: 'Monday' },
  { course: 'Calculus', day: 'Tuesday' },
]
for (const [i, { course }] of sessions.entries()) console.log('form 12 (index):', i, course)
