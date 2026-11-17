// Meryem Esma Eröz, 2200005798
// Bonus 2: experiments that go deeper than the twelve forms. Run with `npm run depth`.

// ---------------------------------------------------------------------------
// D1. What does an array pattern really call on the value?

// A spy: an iterable that logs every step the pattern asks for.
function spy(label, items) {
  return {
    [Symbol.iterator]() {
      console.log(`  ${label}: [Symbol.iterator]() called`)
      let i = 0
      return {
        next() {
          const done = i >= items.length
          console.log(`  ${label}: next() -> ${done ? 'done' : JSON.stringify(items[i])}`)
          return done ? { done: true, value: undefined } : { done: false, value: items[i++] }
        },
        return() {
          console.log(`  ${label}: return() called (the pattern stopped early)`)
          return { done: true, value: undefined }
        },
      }
    },
  }
}

console.log('D1 two variables from three items:')
const [a1, b1] = spy('stops', ['Kadıköy', 'Üsküdar', 'Adalar'])
console.log('D1 result:', a1, b1)

console.log('D1 two variables from one item:')
const [a2, b2] = spy('short', ['Kadıköy'])
console.log('D1 result:', a2, b2)

console.log('D1 rest reads everything:')
const [first, ...rest] = spy('rest', ['Kadıköy', 'Üsküdar', 'Adalar'])
console.log('D1 result:', first, rest)

console.log('D1 empty pattern:')
const [] = spy('empty', ['Kadıköy'])

// Things that are iterable but are not arrays
const [c1, c2, ...cRest] = 'Dönence'
console.log('D1 string:', c1, c2, cRest)
const [emoji] = '🚢 ferry'
console.log('D1 emoji (one code point, not two halves):', emoji, '| [0] gives:', JSON.stringify('🚢'[0]))
const [s1, s2] = new Set(['OOP', 'Calculus', 'OOP'])
console.log('D1 Set (no duplicates, insertion order):', s1, s2)
const [[day, room]] = new Map([['Monday', 'A-204']])
console.log('D1 Map (each item is a [key, value] pair):', day, room)

function* countdown() {
  console.log('  generator: started')
  yield 3
  yield 2
  console.log('  generator: this line never runs')
  yield 1
}
const [g1, g2] = countdown()
console.log('D1 generator (lazy, only two values made):', g1, g2)

function* forever() {
  let n = 1
  while (true) yield n++
}
const [n1, n2, n3] = forever()
console.log('D1 infinite generator, first three:', n1, n2, n3)

// An object pattern does not iterate: it reads properties, so it works on arrays too.
const { 0: zero, length, [length - 1]: last } = ['Eminönü', 'Karaköy', 'Kadıköy']
console.log('D1 object pattern on an array:', zero, length, last)

// ---------------------------------------------------------------------------
// D2. Order of evaluation of defaults

let calls = 0
function expensiveDefault(name) {
  calls++
  console.log(`  default for ${name} computed (call ${calls})`)
  return `${name}-default`
}

console.log('D2 default is computed only when needed:')
const { x = expensiveDefault('x'), y = expensiveDefault('y') } = { x: 'given' }
console.log('D2 result:', x, y, '| calls:', calls)

console.log('D2 left to right, and a later default can use an earlier variable:')
const [start = 9, end = start + 1, label = `${start}-${end}`] = []
console.log('D2 result:', start, end, label)

try {
  // an earlier default using a LATER variable: it is still in its TDZ
  eval('const [p = q, q = 1] = []')
} catch (error) {
  console.log('D2 earlier default uses a later variable:', error.constructor.name, '-', error.message)
}

console.log('D2 the right side is evaluated first, then targets left to right:')
const log = []
const target = {
  set a(v) { log.push(`set a = ${v}`) },
  set b(v) { log.push(`set b = ${v}`) },
}
;[target.a, target.b] = (log.push('right side evaluated'), [1, 2])
console.log('D2 result:', log)

// a parameter default is evaluated on every call, not once
function addTask(title, createdAt = (calls++, Date.now())) {
  return { title, createdAt }
}
calls = 0
addTask('a')
addTask('b')
console.log('D2 parameter default evaluated per call:', calls, 'times')

// ---------------------------------------------------------------------------
// D3. Destructuring in other places

try {
  JSON.parse('{ broken')
} catch ({ name, message }) {
  console.log('D3 catch ({ name, message }):', name, '-', message)
}

const course = { code: 'SEN0415', credits: 6 }
const keysIn = []
for (const key in course) keysIn.push(key)
const pairsOf = []
for (const [key, value] of Object.entries(course)) pairsOf.push(`${key}=${value}`)
console.log('D3 for...in gives keys:', keysIn, '| for...of + entries gives pairs:', pairsOf)
for (const [k, v] in { ab: 1 }) console.log('D3 for...in pattern on the key "ab":', k, v)

// any assignment target works: properties, array slots, even nested
const box = {}
const arr = []
;({ title: box.heading, tags: [arr[0], ...arr[1]] } = { title: 'Dune', tags: ['sf', 'classic', 'desert'] })
console.log('D3 targets are properties and array slots:', box, arr)

// a default on an assignment target, and a swap of object properties
const pair = { left: 'Kadıköy', right: 'Üsküdar' }
;[pair.left, pair.right] = [pair.right, pair.left]
console.log('D3 swap two properties:', pair)

// named imports LOOK like destructuring but are not (no defaults, no rename with ":")
const fs = await import('node:path')
const { basename, extname: ext = () => '?' } = fs
console.log('D3 destructuring the module object:', basename('/a/b/README.md'), ext('README.md'))
// load two tiny modules from data: URLs to see what the import syntax accepts
const asModule = (code) => import('data:text/javascript,' + encodeURIComponent(code))
try {
  await asModule("import { basename: base } from 'node:path'")
} catch (error) {
  console.log('D3 import { a: b }:', error.constructor.name, '-', error.message)
}
const ok = await asModule("import { basename as base } from 'node:path'; export const r = base('/x/y.md')")
console.log('D3 import { a as b } works:', ok.r)
