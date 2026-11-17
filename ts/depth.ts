// Meryem Esma Eröz, 2200005798
// Bonus 2, D4: taking TYPES apart, in the same spirit as destructuring values.
// Run with `npx tsx ts/depth.ts`; the real test is that `npm run check` accepts it.

// A pattern on the left takes a value apart; `infer` in a conditional type takes a TYPE apart.
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F
  : undefined
type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : []
// A value pattern cannot take the last item ([...a, last] is a SyntaxError, see Bonus 3),
// but a type pattern can, because a tuple type may have a rest element in the middle.
type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L
  : undefined

type Trip = [stop: string, minutes: number, ferry: boolean]

// Each line only compiles when the type on the left is exactly the computed one.
type Equal<A, B> = (<G>() => G extends A ? 1 : 2) extends (<G>() => G extends B ? 1 : 2)
  ? true
  : false
const check1: Equal<First<Trip>, string> = true
const check2: Equal<Rest<Trip>, [minutes: number, ferry: boolean]> = true
const check3: Equal<Last<Trip>, boolean> = true
const check4: Equal<First<[]>, undefined> = true
console.log('D4 First/Rest/Last of Trip compile:', check1, check2, check3, check4)

// The value version and the type version side by side
const trip: Trip = ['Kadıköy', 25, true]
const [stop, ...others] = trip // stop: string, others: [minutes: number, ferry: boolean]
const firstStop: First<Trip> = stop
const otherParts: Rest<Trip> = others
console.log('D4 value and type agree:', firstStop, otherParts)

// Object types: take one property's type out, like `const { title } = book` does for a value
type PropType<T, K extends keyof T> = T extends { [P in K]: infer V } ? V : never
type Book = { title: string; pages: number; tags: string[] }
const check5: Equal<PropType<Book, 'tags'>, string[]> = true
console.log('D4 PropType<Book, "tags"> is string[]:', check5)

// Parameters<F>: the types of a function's parameter list, as a tuple
function startTimer({ subject, minutes = 25 }: { subject: string; minutes?: number }) {
  return `${subject}: ${minutes} min`
}
type TimerArgs = Parameters<typeof startTimer> // [{ subject: string; minutes?: number }]
type TimerOptions = First<TimerArgs>
const opts: TimerOptions = { subject: 'Calculus' }
const check6: Equal<TimerOptions, { subject: string; minutes?: number }> = true
console.log('D4 options type taken from the function itself:', startTimer(opts), check6)

// Parameters + rest: forward any call with exactly the same arguments
function logged<A extends unknown[], R>(fn: (...args: A) => R) {
  return (...args: A): R => {
    console.log('D4 call with', JSON.stringify(args))
    return fn(...args)
  }
}
const loggedTimer = logged(startTimer) // (args_0: { subject: string; minutes?: number }) => string
console.log('D4 result:', loggedTimer({ subject: 'OOP', minutes: 50 }))
