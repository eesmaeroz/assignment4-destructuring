// Meryem Esma Eröz, 2200005798
// Lines the compiler REJECTS on purpose. Not part of `npm run check`.
// Run `npm run errors` to see the real messages. Each block is numbered E1, E2, ...
export {}

// E1 (T1): writing the type inside the pattern. `string` and `number` become variable names.
function describeWrong({ title: string, seconds: number }) {
  return `${string} ${number}`
}

// E2 (T3): noUncheckedIndexedAccess, using the first item without a check
const courses: string[] = ['Calculus', 'OOP']
const [firstCourse] = courses
console.log(firstCourse.toUpperCase())

// E3 (T4): an optional field without a default stays `| undefined`
type Settings = { theme?: 'light' | 'dark'; fontSize: number }
const settings: Settings = { fontSize: 14 }
const { theme } = settings
console.log(theme.toUpperCase())

// E4 (form 9): a nested pattern through an optional object
type Book = { title: string; borrower?: { name: string } }
const book: Book = { title: 'Dune' }
const { borrower: { name } } = book
console.log(name)

// E5 (form 11): no `= {}` default, and the call has no argument
type TimerOptions = { minutes?: number }
function startTimer({ minutes = 25 }: TimerOptions) {
  return minutes
}
startTimer()

// E6 (T5): a property that is not in the type
type Course = { code: string; credits: number }
const course: Course = { code: 'SEN0415', credits: 6 }
const { teacher } = course
console.log(teacher)

// E7 (T2): an `as const` tuple is readonly, so the swap pattern cannot write into it
const fixed = ['OOP', 'Calculus'] as const
;[fixed[0], fixed[1]] = [fixed[1], fixed[0]]

// E8 (form 4/T2): more variables than the tuple has positions
const pair: [string, number] = ['OOP', 3]
const [courseName, hours, room] = pair
console.log(courseName, hours, room)
