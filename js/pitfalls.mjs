// Meryem Esma Eröz, 2200005798
// Things that surprise people. Run with `node js/pitfalls.mjs`.

// Pitfall 1: destructuring undefined or null throws a TypeError.
for (const value of [undefined, null]) {
  try {
    const { title } = value
    console.log(title)
  } catch (error) {
    console.log('pitfall 1:', error.constructor.name, '-', error.message)
  }
}
// an empty object or a number is fine: a number is boxed, it just has no title
const { title: t1 } = {}
const { title: t2 } = 42
console.log('pitfall 1 ({} and 42 are fine):', t1, t2)

// Pitfall 2: a default only applies to undefined, not to null
const fromApi = { volume: null, theme: undefined }
const { volume = 50, theme = 'light' } = fromApi
console.log('pitfall 2:', volume, theme)
// a fix if null should also mean "use the default": ?? after the pattern
const safeVolume = fromApi.volume ?? 50
console.log('pitfall 2 (fix with ??):', safeVolume)

// Pitfall 3: assigning without const/let needs parentheses, ({ a } = obj)
let city
let district
// { city, district } = { city: 'İstanbul', district: 'Fatih' }  <- SyntaxError: Unexpected token '='
;({ city, district } = { city: 'İstanbul', district: 'Fatih' })
console.log('pitfall 3:', city, district)
try {
  // eval so that the file still parses; the real line is a SyntaxError
  eval("let a; { a } = { a: 1 }")
} catch (error) {
  console.log('pitfall 3 (without parentheses):', error.constructor.name, '-', error.message)
}

// Pitfall 4: it copies references, not deep copies (nested objects are shared)
const original = { name: 'Notebook', owner: { name: 'Esma' } }
const { owner, ...rest } = original
owner.name = 'Changed'
rest.name = 'Changed too'
console.log('pitfall 4:', original.owner.name, original.name)

// Pitfall 5: in objects the order does not matter, in arrays it does
const song = { title: 'Dönence', artist: 'Barış Manço' }
const { artist, title } = song
const [x, y] = ['Dönence', 'Barış Manço']
const [artist2, title2] = ['Dönence', 'Barış Manço'] // wrong order, no error
console.log('pitfall 5 (object):', artist, '/', title)
console.log('pitfall 5 (array):', x, '/', y, '| wrong names:', artist2, '/', title2)

// Pitfall 6: a missing comma or an array pattern on a non-iterable
try {
  const [first] = { 0: 'a', length: 1 } // array-like but not iterable
  console.log(first)
} catch (error) {
  console.log('pitfall 6:', error.constructor.name, '-', error.message)
}

// Pitfall 7: a line starting with [ after a line without a semicolon
let a = 1
let b = 2
const sum = a + b
;[a, b] = [b, a] // without the leading ; this line would be read as `b[a, b] = ...`
console.log('pitfall 7:', a, b, sum)
try {
  eval('let m = 1\nlet n = 2\nconst total = m + n\n[m, n] = [n, m]')
} catch (error) {
  console.log('pitfall 7 (without the ;):', error.constructor.name, '-', error.message)
}
