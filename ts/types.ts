// Meryem Esma Eröz, 2200005798
// What only TypeScript adds (topics T1 to T5). Run with `npx tsx ts/types.ts`.
// The lines the compiler rejects are in errors/types-errors.ts (run `npm run errors`).

// T1: `{ a: string }` inside a pattern is a RENAME, not a type.
const song = { title: 'Dönence', seconds: 446 }
const { title: string } = song // renames title to a variable called "string"!
console.log('T1 (rename, not a type):', string)
// the type goes AFTER the whole pattern:
function describe({ title, seconds }: { title: string; seconds: number }): string {
  return `${title} (${Math.round(seconds / 60)} min)`
}
console.log('T1 (type after the pattern):', describe(song))

// T2: a tuple return type, and what `as const` does.
function splitTime(text: string): [number, string] {
  const [h = '0', rest = ''] = text.split(':')
  return [Number(h), rest]
}
const [hour, minutes] = splitTime('14:30') // hour: number, minutes: string
console.log('T2 tuple:', hour + 1, minutes.padStart(3, '0'))
const loose = ['OOP', 3] // type: (string | number)[]
const fixed = ['OOP', 3] as const // type: readonly ['OOP', 3]
const [looseName, looseHours] = loose // string | number | undefined, each
const [fixedName, fixedHours] = fixed // 'OOP' and 3, exact literal types
console.log('T2 loose:', typeof looseName, typeof looseHours)
console.log('T2 as const:', fixedName.toLowerCase(), fixedHours * 2)
// a function without a tuple return type gives an array type, not a tuple:
function noTupleType() {
  return ['a', 1]
}
const [maybeName] = noTupleType() // string | number | undefined
console.log('T2 inferred array:', maybeName)

// T3: noUncheckedIndexedAccess
const courses: string[] = ['Calculus', 'OOP']
const [firstCourse] = courses // firstCourse: string | undefined
if (firstCourse !== undefined) {
  console.log('T3 narrowed:', firstCourse.toUpperCase())
}
const [firstOrDefault = 'none'] = courses // string, the default removes undefined
console.log('T3 default:', firstOrDefault.length)
const noCourses: string[] = []
const [missing] = noCourses
console.log('T3 really missing:', missing, '->', missing?.toUpperCase() ?? '(handled)')
const pair: [string, string] = ['Calculus', 'OOP']
const [tupleFirst] = pair // tuple: string, never undefined
console.log('T3 tuple has no undefined:', tupleFirst.toUpperCase())

// T4: defaults and optional fields
type Settings = { theme?: 'light' | 'dark'; fontSize: number }
const settings: Settings = { fontSize: 14 }
const { theme } = settings // 'light' | 'dark' | undefined
const { theme: themeWithDefault = 'light' } = settings // 'light' | 'dark'
const { fontSize = 12 } = settings // number (the default is never used, but allowed)
console.log('T4:', theme, themeWithDefault, fontSize)
function applySettings({ theme = 'dark', fontSize }: Settings): string {
  return `${theme.toUpperCase()} ${fontSize}px` // theme is not undefined here
}
console.log('T4 in parameter:', applySettings(settings))

// T5: one compile error that destructuring causes, with the fix.
type Course = { code: string; credits: number }
const course: Course = { code: 'SEN0415', credits: 6 }
// @ts-expect-error Property 'teacher' does not exist on type 'Course'.
const { teacher } = course
console.log('T5 at run time it is just undefined:', teacher)
// fix: take only fields that are in the type, or add the field (optional) to the type
type CourseWithTeacher = { code: string; credits: number; teacher?: string }
const courseV2: CourseWithTeacher = course // allowed: teacher is optional
const { teacher: fixedTeacher = 'unknown' } = courseV2
console.log('T5 fixed:', fixedTeacher)
