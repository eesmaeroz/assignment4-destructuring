# Destructuring Field Guide

Name: Meryem Esma Eröz  
Student number: 2200005798  
Course: SEN0415 Advanced Web Programming, Fall 2026, Assignment 4

Bonuses claimed: **Bonus 1: LaTeX**, **Bonus 2: Depth**, **Bonus 3: Real code** and **Bonus 4: Git repository** (the four sections are before My own log).

My data in the examples: ferry trips from Eminönü, a Turkish playlist, books on my reading
list, my course schedule and cards for a student dashboard.

## Run

```
npm install
npm run all      # runs the JS and TS examples
npm run check    # type-checks in strict mode
npm run errors   # compiles errors/, the lines that are SUPPOSED to fail (always exits 0)
npm run depth    # Bonus 2 experiments (js/depth.mjs and ts/depth.ts)
```

Node 22, TypeScript 5.8, React 19. `output.txt` is `npm run all > output.txt`.
React prints its warnings with `console.error`, so they go to stderr and are **not** in
`output.txt`; I saved them separately in `output-stderr.txt`. The compiler messages for the
rejected lines are in `errors/compiler-output.txt`.

### Files

| File | What is in it |
|---|---|
| `js/arrays.mjs` | forms 1–4 |
| `js/objects.mjs` | forms 5–10 |
| `js/params.mjs` | forms 11, 11b, 12 |
| `js/pitfalls.mjs` | seven pitfalls |
| `js/props.jsx` | P1–P6 and the "change props" experiment |
| `ts/arrays.ts`, `ts/objects.ts`, `ts/params.ts` | forms 1–12 with types |
| `ts/types.ts` | T1–T5 |
| `ts/props.tsx` | P1–P7 typed |
| `errors/types-errors.ts`, `errors/props-errors.tsx` | E1–E17: code the compiler rejects, on purpose |
| `js/depth.mjs`, `ts/depth.ts` | Bonus 2: iterables, evaluation order, other places, type-level patterns |

### One idea for the whole guide

A pattern on the left is a short way to write several plain assignments. Every entry below
shows the plain version, because if I can write the plain version I know what the pattern
does.

**Rest and spread** use the same three dots for opposite jobs:

- **rest** is on the *left* (in a pattern): `const [first, ...others] = list` — *collects* the
  leftover items **into** a new array/object.
- **spread** is on the *right* (in an expression): `const copy = [...list]`,
  `<section {...rest}>` — *expands* an array/object **out** into separate items.

---

## Field guide

### Form 1: values by position, `const [x, y] = f()`

**Syntax:** `const [shortest, longest] = shortestAndLongest(ferryMinutes)`

**Example** (`js/arrays.mjs`):

```js
function shortestAndLongest(minutes) {
  return [Math.min(...minutes), Math.max(...minutes)]
}
const ferryMinutes = [25, 15, 40, 20] // Kadıköy, Üsküdar, Adalar, Beşiktaş
const [shortest, longest] = shortestAndLongest(ferryMinutes)
console.log('form 1:', shortest, longest)
const [onlyFirst] = shortestAndLongest(ferryMinutes)
const [p, q, r] = shortestAndLongest(ferryMinutes)
```

**Plain version:** `const pair = f(); const shortest = pair[0]; const longest = pair[1]`

**Output:**

```
form 1: 15 40
form 1 (only first): 15
form 1 (one too many): 15 40 undefined
```

**Use it when:** a function returns a small, fixed number of values in a known order
(`useState`, `useReducer`, `Object.entries` pairs).

**Watch out:** only the position counts, not the name. Fewer variables than items is fine
(extras ignored); more variables gives `undefined`, without an error in JavaScript. In
TypeScript, a tuple return type makes the extra variable a compile error (E8).

### Form 2: skip and collect, `const [, second, ...others] = list`

**Syntax:** `const [, secondSong, ...laterSongs] = playlist`

**Example** (`js/arrays.mjs`):

```js
const playlist = ['Gesi Bağları', 'Bir Derdim Var', 'Leylim Ley', 'Dönence', 'Kara Toprak']
const [, secondSong, ...laterSongs] = playlist
const [, , thirdSong] = playlist
const [one, ...nothingLeft] = ['Dönence']
const copy = [...playlist] // spread, not rest
```

**Plain version:** `const secondSong = playlist[1]; const laterSongs = playlist.slice(2)`

**Output:**

```
form 2: Bir Derdim Var [ 'Leylim Ley', 'Dönence', 'Kara Toprak' ]
form 2 (skip two): Leylim Ley
form 2 (empty rest): Dönence []
form 2 (spread copy is a new array): false 5
```

**Use it when:** you want "the head and the tail" of a list, or a fixed slot in the middle.

**Watch out:** each empty comma is one skipped item, and `, ,` is easy to misread. The rest
element is never `undefined`, it is an empty array when nothing is left, and it must be
the **last** item in the pattern.

### Form 3: swap, `[a, b] = [b, a]`

**Syntax:** `;[morningLine, eveningLine] = [eveningLine, morningLine]`

**Example** (`js/arrays.mjs`):

```js
let morningLine = 'Kadıköy'
let eveningLine = 'Üsküdar'
;[morningLine, eveningLine] = [eveningLine, morningLine]
const queue = ['Adalar', 'Beşiktaş', 'Kadıköy']
;[queue[0], queue[2]] = [queue[2], queue[0]]
```

**Plain version:** `let tmp = a; a = b; b = tmp` — the right side `[b, a]` is a new
temporary array, so the pattern does the `tmp` for me.

**Output:**

```
form 3: Üsküdar Kadıköy
form 3 (inside an array): [ 'Kadıköy', 'Beşiktaş', 'Adalar' ]
```

**Use it when:** swapping two variables or two array slots (sorting by hand).

**Watch out:** there is no `const`/`let`, so the line starts with `[`. Without a semicolon on
the line before, JavaScript glues it to the previous line (pitfall 7). I start such lines with
`;`. The variables must be `let`, not `const`.

### Form 4: array defaults, `const [a = 1, b = 2] = []`

**Syntax:** `const [firstStop = 'Eminönü', secondStop = 'Karaköy'] = ['Kabataş']`

**Example** (`js/arrays.mjs`):

```js
const [firstStop = 'Eminönü', secondStop = 'Karaköy'] = ['Kabataş']
const [d1 = 'default'] = [undefined]
const [d2 = 'default'] = [null]
const [d3 = 'default'] = [0]
const [d4 = 'default'] = ['']
```

**Plain version:** `let secondStop = arr[1]; if (secondStop === undefined) secondStop = 'Karaköy'`

**Output:**

```
form 4: Kabataş Karaköy
form 4 (undefined, null, 0, empty string): default null 0 ""
```

**Use it when:** the array may be shorter than you need (`text.split(':')`).

**Watch out:** the test is `=== undefined`, not "falsy". `null`, `0` and `''` are kept. That
is different from `||`, which would replace all of them.

### Form 5: by name, `let { a, b } = t`

**Syntax:** `let { title, pages } = book`

**Example** (`js/objects.mjs`):

```js
const book = {
  id: 'b7', title: 'Kürk Mantolu Madonna',
  author: { name: 'Sabahattin Ali', born: 1907 },
  pages: 160, tags: ['novel', 'classic', 'berlin'],
}
let { title, pages } = book
let { isbn } = book
pages = 999
console.log('form 5 (after pages = 999):', pages, book.pages)
```

**Plain version:** `let title = book.title; let pages = book.pages`

**Output:**

```
form 5: Kürk Mantolu Madonna 160
form 5 (missing field): undefined
form 5 (after pages = 999): 999 160
```

**Use it when:** you need several fields of one object and the field names are good
variable names.

**Watch out:** the variable name **must** be the property name. A typo (`titel`) is silently
`undefined` in JavaScript; TypeScript catches it (E6). The variables are copies of the
values: changing `pages` does not change `book.pages`.

### Form 6: rename, `const { a: alpha } = t`

**Syntax:** `const { title: heading, pages: pageCount } = book`

**Example** (`js/objects.mjs`):

```js
const { title: heading, pages: pageCount } = book
console.log('form 6:', heading, pageCount)
console.log(pageCountX) // in a try/catch
```

**Plain version:** `const heading = book.title; const pageCount = book.pages`

**Output:**

```
form 6: Kürk Mantolu Madonna 160
form 6 (old name is not created, only the new one): pageCountX is not defined
```

**Use it when:** the property name clashes with a variable you already have (two `title`s
in one function), or it is not a clear name in this place.

**Watch out:** read the colon as "goes into": `title: heading` = "title goes into heading".
It looks exactly like a TypeScript type annotation, but it is not (T1).

### Form 7: object defaults, `const { a = 1 } = t`

**Syntax:** `const { status = 'to-read' } = book`

**Example** (`js/objects.mjs`):

```js
const { status = 'to-read', pages: p7 = 100 } = book
const { rating = 3 } = { rating: undefined }
const { score = 3 } = { score: null }
const { language: lang = 'tr' } = book
```

**Plain version:** `let status = book.status; if (status === undefined) status = 'to-read'`

**Output:**

```
form 7: to-read 160
form 7 (undefined vs null): 3 null
form 7 (rename + default): tr
```

**Use it when:** reading settings or options where a missing field has a sensible value.

**Watch out:** `null` does **not** trigger the default (pitfall 2). Rename and default
together are written `source: newName = default`.

### Form 8: object rest, `const { a, ...others } = t`

**Syntax:** `const { id, ...withoutId } = book`

**Example** (`js/objects.mjs`):

```js
const { id, ...withoutId } = book
console.log('form 8 (rest is a new object):', withoutId === book, Object.keys(withoutId))
console.log('form 8 (but nested values are shared):', withoutId.author === book.author)
```

**Plain version:** `const id = book.id; const withoutId = { ...book }; delete withoutId.id`

**Output:**

```
form 8: b7 {
  title: 'Kürk Mantolu Madonna',
  author: { name: 'Sabahattin Ali', born: 1907 },
  pages: 160,
  tags: [ 'novel', 'classic', 'berlin' ]
}
form 8 (rest is a new object): false [ 'title', 'author', 'pages', 'tags' ]
form 8 (but nested values are shared): true
```

**Use it when:** you want "everything except these" — removing a field without `delete`,
or passing the remaining props on to a DOM element (P4).

**Watch out:** the copy is **shallow**: `withoutId` is a new object, but `withoutId.author`
is the same object as `book.author` (pitfall 4).

### Form 9: nested patterns, `const { p: { x }, list: [first] } = t`

**Syntax:** `const { author: { name: authorName, born }, tags: [firstTag, ...otherTags] } = book`

**Example** (`js/objects.mjs`):

```js
const { author: { name: authorName, born }, tags: [firstTag, ...otherTags] } = book
console.log(author) // in a try/catch
const loanedBook = { title: 'Saatleri Ayarlama Enstitüsü' }
const { borrower: { name: borrowerName } = { name: 'nobody' } } = loanedBook
const { borrower: { name } } = loanedBook // in a try/catch
```

**Plain version:** `const authorName = book.author.name; const born = book.author.born;
const firstTag = book.tags[0]; const otherTags = book.tags.slice(1)`

**Output:**

```
form 9: Sabahattin Ali 1907 novel [ 'classic', 'berlin' ]
form 9 (author is only a path, not a variable): author is not defined
form 9 (nested with default): nobody
form 9 (nested without default): Cannot read properties of undefined (reading 'name')
```

**Use it when:** you need one or two values deep inside a structure that you know is there
(an API response, a config).

**Watch out:** the middle names (`author:`, `tags:`) are a path, not variables. If a middle
object is missing, the whole line throws, so give the middle part a default (`= {...}`).
Deep patterns are hard to read: two levels is my limit.

### Form 10: computed key, `const { [key]: value } = t`

**Syntax:** `const { [field]: value = '(none)' } = book`

**Example** (`js/objects.mjs`):

```js
function pick(obj, key) {
  const { [key]: value } = obj
  return value
}
for (const field of ['title', 'pages', 'year']) {
  const { [field]: value = '(none)' } = book
  console.log(`form 10 (${field}):`, value)
}
```

**Plain version:** `const value = obj[key]`

**Output:**

```
form 10: Kürk Mantolu Madonna 160
form 10 (title): Kürk Mantolu Madonna
form 10 (pages): 160
form 10 (year): (none)
```

**Use it when:** the field name is in a variable — and especially together with rest:
`const { [key]: removed, ...others } = obj` removes a field whose name you only know at run
time.

**Watch out:** you **must** rename: `const { [key] } = obj` is a syntax error, because a
computed key does not give the variable a name. In TypeScript, use `K extends keyof T` so
the value type is `T[K]` (`ts/objects.ts`).

### Form 11: patterns in parameters, `function f({ a = 1, b }: Options = {})`

**Syntax:** `function startTimer({ subject, minutes = 25, breakMinutes = 5 } = {})`

**Example** (`js/params.mjs`):

```js
function startTimer({ subject, minutes = 25, breakMinutes = 5 } = {}) {
  return `${subject ?? 'nothing'}: ${minutes} min work, ${breakMinutes} min break`
}
startTimer({ subject: 'Calculus', minutes: 50 })
startTimer()
startTimer({ subject: 'OOP', minutes: null })
function startTimerNoDefault({ subject }) { return subject }
startTimerNoDefault() // in a try/catch
const toMinutes = ([hours, minutes = 0]) => hours * 60 + minutes
```

**Plain version:**

```js
function startTimer(options) {
  if (options === undefined) options = {}
  let minutes = options.minutes
  if (minutes === undefined) minutes = 25
  // ...
}
```

**Output:**

```
form 11: Calculus: 50 min work, 5 min break
form 11 (no argument): nothing: 25 min work, 5 min break
form 11 (null minutes): OOP: null min work, 5 min break
form 11 (no = {}): Cannot destructure property 'subject' of 'undefined' as it is undefined.
form 11b: 90 120
```

**Use it when:** a function has more than two or three options — the caller writes names,
not positions, and can leave any of them out. Every React component with
`({ title, children })` is this form.

**Watch out:** there are two levels of defaults: `minutes = 25` is for a missing field, and
the `= {}` at the end is for a missing **argument**. Without `= {}`, calling with no argument
throws. In TypeScript the order is `pattern : Type = default`.

### Form 12: patterns in loops, `for (const [k, v] of Object.entries(o))`

**Syntax:** `for (const [course, hours] of Object.entries(hoursPerCourse))`

**Example** (`js/params.mjs`):

```js
const hoursPerCourse = { Calculus: 4, OOP: 3, 'Web Programming': 3 }
for (const [course, hours] of Object.entries(hoursPerCourse)) console.log(course, hours)
const roomOf = new Map([['Monday', 'A-204'], ['Wednesday', 'Lab 3']])
for (const [day, room] of roomOf) console.log(day, room)
for (const { course, day } of sessions) console.log(day, course)
sessions.map(({ course }) => course)
for (const [i, { course }] of sessions.entries()) console.log(i, course)
```

**Plain version:** `for (const entry of Object.entries(o)) { const k = entry[0]; const v = entry[1] }`

**Output:**

```
form 12 (object): Calculus 4
form 12 (object): OOP 3
form 12 (object): Web Programming 3
form 12 (Map): Monday A-204
form 12 (Map): Wednesday Lab 3
form 12 (objects): Monday OOP
form 12 (objects): Tuesday Calculus
form 12 (map): [ 'OOP', 'Calculus' ]
form 12 (index): 0 OOP
form 12 (index): 1 Calculus
```

**Use it when:** looping over key/value pairs. A `Map` already gives `[key, value]` pairs, so
no `.entries()` is needed; an object needs `Object.entries`.

**Watch out:** a new variable is created for every round, so `const` is fine. The pattern is
an **array** pattern for entries (`[k, v]`) and an **object** pattern for arrays of objects
(`{ course }`) — mixing them up gives `undefined` or a "not iterable" error.

---

## Pitfalls

All output from `js/pitfalls.mjs`.

**1. Destructuring `undefined` or `null` throws.**

```js
const { title } = value // value is undefined, then null
const { title: t1 } = {}
const { title: t2 } = 42
```
```
pitfall 1: TypeError - Cannot destructure property 'title' of 'value' as it is undefined.
pitfall 1: TypeError - Cannot destructure property 'title' of 'value' as it is null.
pitfall 1 ({} and 42 are fine): undefined undefined
```
*Why:* an object pattern reads properties from the value, and `undefined`/`null` are the only
two values that cannot have properties (even `42` is boxed into a `Number` object that just
has no `title`).

**2. A default works for `undefined`, not for `null`.**

```js
const fromApi = { volume: null, theme: undefined }
const { volume = 50, theme = 'light' } = fromApi
const safeVolume = fromApi.volume ?? 50
```
```
pitfall 2: null light
pitfall 2 (fix with ??): 50
```
*Why:* the specification checks `value === undefined` before using the default; `null` means
"there is a value, and it is empty", so it is kept. JSON from a server often has `null`, so
use `??` after the pattern when `null` should also mean "use the default".

**3. Assignment without `const`/`let` needs parentheses.**

```js
let city, district
;({ city, district } = { city: 'İstanbul', district: 'Fatih' })
eval("let a; { a } = { a: 1 }")
```
```
pitfall 3: İstanbul Fatih
pitfall 3 (without parentheses): SyntaxError - Unexpected token '='
```
*Why:* a statement that starts with `{` is read as a **block**, so `{ a }` is a block with the
expression `a` in it, and then `= { a: 1 }` makes no sense. The parentheses force it to be an
expression.

**4. It copies references, not deep copies.**

```js
const original = { name: 'Notebook', owner: { name: 'Esma' } }
const { owner, ...rest } = original
owner.name = 'Changed'
rest.name = 'Changed too'
console.log('pitfall 4:', original.owner.name, original.name)
```
```
pitfall 4: Changed Notebook
```
*Why:* destructuring copies what is in each property; for an object that is a reference to
the same object. `rest` is a new top-level object (so `rest.name` is separate), but
`owner` points to the very same inner object as `original.owner`.

**5. Order matters in arrays, not in objects.**

```js
const { artist, title } = { title: 'Dönence', artist: 'Barış Manço' }
const [artist2, title2] = ['Dönence', 'Barış Manço']
```
```
pitfall 5 (object): Barış Manço / Dönence
pitfall 5 (array): Dönence / Barış Manço | wrong names: Dönence / Barış Manço
```
*Why:* an object pattern matches by **name**, an array pattern by **position**. Giving array
variables "good" names does not help: `artist2` holds the title, and nothing warns me.

**6. An array pattern needs an iterable, not just something array-like.**

```js
const [first] = { 0: 'a', length: 1 }
```
```
pitfall 6: TypeError - {(intermediate value)(intermediate value)} is not iterable
```
*Why:* an array pattern does not use `[0]`; it calls the value's `Symbol.iterator` and asks
for items one by one. A plain object has no iterator, even if it has `0` and `length`.

**7. A line that starts with `[` and no semicolon before it.**

```js
eval('let m = 1\nlet n = 2\nconst total = m + n\n[m, n] = [n, m]')
```
```
pitfall 7 (without the ;): SyntaxError - Invalid left-hand side in assignment
```
*Why:* automatic semicolon insertion does not insert one before `[`, so the code is read as
`const total = m + n[m, n] = [n, m]` — indexing into `n`. That is why form 3 starts with `;`.

---

## Props and children

All rendering is done with `renderToStaticMarkup` in `js/props.jsx` (and typed again in
`ts/props.tsx`). Output is copied from `output.txt`; React warnings are from
`output-stderr.txt`.

### P1: props is one object

```jsx
function CourseCardA(props) {
  console.log('P1 props object:', props)
  return <section><h2>{props.title}</h2>{props.children}</section>
}
function CourseCardB({ title, children }) {
  return <section><h2>{title}</h2>{children}</section>
}
function CourseCardC(props) {
  const { title, children } = props
  return <section><h2>{title}</h2>{children}</section>
}
```
```
P1 props object: { title: 'SEN0415', children: 'Advanced Web Programming' }
P1 A: <section><h2>SEN0415</h2>Advanced Web Programming</section>
P1 B: <section><h2>SEN0415</h2>Advanced Web Programming</section>
P1 C: <section><h2>SEN0415</h2>Advanced Web Programming</section>
```

React calls the component with **one** argument. `CourseCardB` is **form 11** (a pattern in
the parameter) whose pattern is **form 5** (properties by name). `CourseCardC` is the same
thing in two steps. The log shows that `children` sits in the same object as `title`.

### P2: children is only a prop

```jsx
<CourseCardB title="OOP">C++ labs</CourseCardB>
<CourseCardB title="OOP" children="C++ labs" />
<CourseCardB title="OOP" children="from attribute">from tags</CourseCardB>
const element = <CourseCardB title="OOP">C++ labs</CourseCardB>
console.log('P2 element.props:', element.props)
```
```
P2 between tags : <section><h2>OOP</h2>C++ labs</section>
P2 as attribute : <section><h2>OOP</h2>C++ labs</section>
P2 both         : <section><h2>OOP</h2>from tags</section>
P2 element.props: { title: 'OOP', children: 'C++ labs' }
```

The content between the tags is just put into the props object under the name `children`.
When both are given, the content between the tags wins: JSX builds the object with the
attributes first and `children` last, so the later one overwrites. TypeScript refuses this
(E10: `'children' are specified twice`).

### P3: what children can be

```jsx
function Box({ children }) { return <div>[{children}]</div> }
```

| children | rendered | note |
|---|---|---|
| `Calculus` (string) | `<div>[Calculus]</div>` | |
| `{4}` | `<div>[4]</div>` | |
| `{0}` | `<div>[0]</div>` | **0 is shown**, unlike `false` |
| `<b>OOP</b>` | `<div>[<b>OOP</b>]</div>` | one element |
| `<b>OOP</b><i>Calculus</i>text` | `<div>[<b>OOP</b><i>Calculus</i>text]</div>` | several → an array |
| `{['a','b','c']}` | `<div>[abc]</div>` | arrays are flattened |
| `{undefined}`, `{null}`, `{false}`, `{true}`, `{''}`, none | `<div>[]</div>` | nothing appears |
| `{() => 'hello'}` | `<div>[]</div>` + warning | `Functions are not valid as a React child. ...` |
| `{{ course: 'OOP' }}` | **throws** | `Objects are not valid as a React child (found: object with keys {course}). ...` |

A function is only useful as children if the component **calls** it:

```jsx
function Countdown({ days, children }) { return <p>{children(days)}</p> }
<Countdown days={12}>{(d) => `Final in ${d} days`}</Countdown>
```
```
P3 function called: <p>Final in 12 days</p>
```

`props.children` is a single value when there is one child and an **array** when there are
several:

```
P3 count one: <span>object</span>
P3 count two: <span>array of 2</span>
P3 count txt: <span>string</span>
```

So `{count && <Badge />}` with `count = 0` would print `0` on the screen; that is why
`0` is the dangerous one in the table.

### P4: separating children from the other props, and the order of spread

```jsx
function Notice({ title, children, ...rest }) {
  console.log('P4 rest has:', Object.keys(rest))
  return <section {...rest}><h3>{title}</h3>{children}</section>
}
<Notice title="Exam" id="midterm" className="warn" data-week="8">Room A-204</Notice>
```
```
P4 rest has: [ 'id', 'className', 'data-week' ]
P4 rest: <section id="midterm" class="warn" data-week="8"><h3>Exam</h3>Room A-204</section>
```

Here three forms work together: form 11 (pattern in the parameter), form 5 (`title`,
`children` by name) and form 8 (`...rest` collects the remaining props). Then `{...rest}` is
a **spread** that puts them back as attributes on the `<section>`.

**Which one wins** — the one written later:

```jsx
<section {...rest} className="notice">   // explicit AFTER spread
<section className="notice" {...rest}>   // explicit BEFORE spread
```
```
P4 after  spread: <section class="notice">x</section>       (caller's "mine" lost)
P4 before spread: <section class="mine">x</section>         (caller's "mine" wins)
P4 before, none : <section class="notice">x</section>       (default when caller gives none)
```

Before = a default the caller may override; after = a value the caller cannot change.

Two things that went to the DOM by accident when I did **not** take them out of `rest`:

```
P4 leaky: <section title="Exam">x</section>
warning: Received `true` for a non-boolean attribute `urgent`.
```

`title` is also a real HTML attribute (tooltip), so it silently appeared on the section.

`key` never reaches the component:

```
P4 key: <span>key is undefined; props keys: title</span>
warning: ShowKey: `key` is not a prop. Trying to access it will result in `undefined` being returned. ...
```

### P5: props or children?

```jsx
function PanelWithProps({ header, footer, body }) {
  return <article><header>{header}</header><main>{body}</main><footer>{footer}</footer></article>
}
function PanelWithChildren({ children }) {
  return <article>{children}</article>
}
```
```
P5 props   : <article><header><h2>Week 8</h2></header><main><p>Midterm</p></main><footer><small>İKÜ</small></footer></article>
P5 children: <article><header><h2>Week 8</h2></header><main><p>Midterm</p></main><footer><small>İKÜ</small></footer></article>
P5 children, wrong order: <article><footer><small>İKÜ</small></footer><header><h2>Week 8</h2></header></article>
```

The output is the same, but who decides the structure is different:

- **Named props** (`header`, `footer`): the **component** decides where each part goes and can
  wrap it. The caller cannot put the footer on top, and in TypeScript can be forced to give a
  header. I choose this when the layout has fixed "slots".
- **children only**: the **caller** decides everything. Flexible, but the component cannot
  enforce anything — the "wrong order" output shows that. I choose this for wrappers
  (a card, a modal, a layout) that should not care what is inside.

Often both: named props for the fixed slots, `children` for the main content.

### P6: defaults

```jsx
function Badge({ label = 'no label', count = 0 }) { return <span>{label}: {count}</span> }
function Frame({ children = <em>(empty)</em> }) { return <div>{children}</div> }
```
```
P6 missing  : <span>no label: 0</span>
P6 undefined: <span>no label: 0</span>
P6 null     : <span>: </span>
P6 given    : <span>Unread: 3</span>
P6 children default, none: <div><em>(empty)</em></div>
P6 children default, null: <div></div>
```

This is form 7. A missing prop and `label={undefined}` are the same thing (the default is
used). `label={null}` is a value, so the default is **not** used, and React renders `null` as
nothing — the badge shows an empty `: `. In `ts/props.tsx` I allowed `count: number | null` in
the type and handled the `null` with `??`.

### P7: types

```tsx
type CardOwn = { title: string; children?: ReactNode }       // by hand
type CardHelper = PropsWithChildren<{ title: string }>       // same type, made for me
type SubmitButtonProps = ComponentProps<'button'> & { busy?: boolean }
```
```
P7 same shape: {"title":"x","children":"y"}
P7 button: <button type="submit" title="save">Save task</button>
P7 busy  : <button type="submit" disabled="">Saving…</button>
P7 required children: <p>must be here</p>
```

What each allows, and what the compiler rejects (`errors/props-errors.tsx`, real messages
from `npm run errors`):

| Type | Allows | Rejects (real error) |
|---|---|---|
| no `children` in the type | only attributes | E9 `Property 'children' does not exist on type 'IntrinsicAttributes & { title: string; }'.` |
| `children?: ReactNode` / `PropsWithChildren` | string, number, element, array, `null`, `undefined`, `boolean` | E11 object: `'course' does not exist in type 'ReactElement<...> \| Iterable<ReactNode> \| ...'`; E12 function: `Type '() => string' is not assignable to type 'ReactNode'.` |
| `children: ReactNode` (required) | same | E13 `Property 'children' is missing in type '{}' but required in type '{ children: ReactNode; }'.` |
| `children: (d: number) => ReactNode` | a function only (render prop) | anything that is not that function |
| `ComponentProps<'button'>` | every real `<button>` attribute, with its real values (`onClick`, `disabled`, `type`) | E14 `Type '"banana"' is not assignable to type '"button" \| "submit" \| "reset" \| undefined'.`; E15 `Property 'href' does not exist ... Did you mean 'ref'?` |
| any props type | — | E16 `Property 'key' does not exist on type '{ title: string; }'.` |

`ComponentProps<'button'>` is what makes `...rest` safe: TypeScript knows that everything in
`rest` is a valid `<button>` attribute.

### Experiment: a component that changes its props

```jsx
function Mutator(props) { props.title = 'changed'; return <span>{props.title}</span> }
function MutateLocal({ title }) { title = title.toUpperCase(); return <span>{title}</span> }
```
```
mutate props: THROWS TypeError - Cannot assign to read only property 'title' of object '#<Object>'
mutate local: <span>ORIGINAL</span>
```

React (development build) freezes the props object. After destructuring, `title` is my own
local variable, so changing it is allowed and does not touch the props.

---

## JavaScript vs TypeScript

| Form / topic | Same in TS | What I must add | Error when I get it wrong |
|---|---|---|---|
| 1 `const [x, y] = f()` | the pattern | a tuple return type `[number, number]` | without it the type is `(string \| number)[]` (T2); extra variable: E8 `Tuple type '[string, number]' of length '2' has no element at index '2'.` |
| 2 `[, second, ...rest]` | the pattern | nothing; `second` is `string \| undefined` for `string[]` | `'second' is possibly 'undefined'.` when used directly |
| 3 swap | the pattern | `let` variables of the same type | on an `as const` array: E7 `Cannot assign to '0' because it is a read-only property.` |
| 4 array defaults | the pattern | nothing — the default removes `undefined` | — |
| 5 `{ a, b } = t` | the pattern | a type for `t` (the variables get theirs from it) | a name not in the type: E6 `Property 'teacher' does not exist on type 'Course'.` |
| 6 rename | the pattern | nothing | writing a type there: E1 `Binding element 'string' implicitly has an 'any' type.` |
| 7 object defaults | the pattern | an optional field `status?:` in the type | optional without default: E3 `'theme' is possibly 'undefined'.` |
| 8 rest | the pattern | nothing — the rest type is computed (`Omit<Book,'id'>`) | — |
| 9 nested | the pattern | a default for an optional middle object | E4 `Property 'name' does not exist on type '{ name: string; } \| undefined'.` |
| 10 computed key | the pattern | `K extends keyof T` to get `T[K]` | — |
| 11 parameters | the pattern | `: Type` **after** the whole pattern, then `= {}` | no `= {}`, call with no argument: E5 `Expected 1 arguments, but got 0.` |
| 12 loops | the pattern | types on the object/Map (`Map<string, string>`) | — |
| T3 `[first] = items` | the pattern | a check or a default | E2 `'firstCourse' is possibly 'undefined'.` |
| props | `({ title, children })` | a props type with `children?: ReactNode` | E9, E10 `'children' are specified twice.` |

---

## TypeScript topics (T1–T5)

From `ts/types.ts`.

**T1 — a colon in a pattern is a rename.**

```ts
const { title: string } = song           // a variable named "string"!
function describe({ title, seconds }: { title: string; seconds: number }) { ... }
```
```
T1 (rename, not a type): Dönence
T1 (type after the pattern): Dönence (7 min)
```
In a parameter, `({ title: string, seconds: number })` compiles to two variables called
`string` and `number` of type `any`, so strict mode rejects it (E1: `Binding element
'string' implicitly has an 'any' type.`). The type always goes after the closing `}`.

**T2 — tuples and `as const`.**

```ts
function splitTime(text: string): [number, string] { ... }
const loose = ['OOP', 3]            // (string | number)[]
const fixed = ['OOP', 3] as const   // readonly ['OOP', 3]
```
```
T2 tuple: 15 030
T2 loose: string number
T2 as const: oop 6
T2 inferred array: a
```
Without `as const` both `looseName` and `looseHours` have type `string | number | undefined`,
so I could not call `.toLowerCase()` or multiply. With `as const` each position has its own
literal type, and the array is readonly (E7). A function without a tuple return type returns
an array type, not a tuple.

**T3 — `noUncheckedIndexedAccess`.**

```ts
const courses: string[] = ['Calculus', 'OOP']
const [firstCourse] = courses                 // string | undefined
const [firstOrDefault = 'none'] = courses     // string
const pair: [string, string] = ['Calculus', 'OOP']
const [tupleFirst] = pair                     // string
```
```
T3 narrowed: CALCULUS
T3 default: 8
T3 really missing: undefined -> (handled)
T3 tuple has no undefined: CALCULUS
```
For `string[]` the compiler does not know the length, so position 0 may not exist. Three fixes:
check (`if (x !== undefined)`), a default, or a tuple type when the length really is fixed.

**T4 — optional fields and defaults.**

```ts
type Settings = { theme?: 'light' | 'dark'; fontSize: number }
const { theme } = settings                              // 'light' | 'dark' | undefined
const { theme: themeWithDefault = 'light' } = settings  // 'light' | 'dark'
```
```
T4: undefined light 14
T4 in parameter: DARK 14px
```
The `?` adds `undefined` to the type; a default takes it away again inside the function. The
caller still sees the field as optional.

**T5 — one compile error.**

```ts
type Course = { code: string; credits: number }
// @ts-expect-error Property 'teacher' does not exist on type 'Course'.
const { teacher } = course
```
```
T5 at run time it is just undefined: undefined
T5 fixed: unknown
```
The message (E6) is `Property 'teacher' does not exist on type 'Course'.` In JavaScript this is
silently `undefined`. The fix: add `teacher?: string` to the type and give a default.

---

## Bonus 1: LaTeX

Bonus 1: LaTeX

The whole field guide is also a LaTeX document with its PDF, in the `latex/` folder:

| File | What it is |
|---|---|
| `latex/destructuring-guide.tex` | the LaTeX source of the guide |
| `latex/destructuring-guide.pdf` | the compiled PDF (title page, linked contents, all sections) |
| `latex/header.tex` | my preamble: minted code style, page header with my name, contents spacing |
| `latex/metadata.yaml` | title, author, fonts, page size |
| `latex/widths.lua`, `latex/inline-code.lua`, `latex/code-blocks.lua` | pandoc filters (table column widths, breakable inline code, code blocks as `minted`) |
| `latex/build.sh` | the commands below in one script |

The content is the guide itself, not a shorter copy: the `.tex` is produced from this
`README.md` (everything from "Bonuses claimed" on), so the twelve entries, the pitfalls,
props and children, the JavaScript vs TypeScript table, the TypeScript topics, the bonus
sections and the log are all in it.

**Commands I used** (in the `latex/` folder; pandoc 3.1, TeX Live with XeLaTeX, minted
2.9 and Pygments 2.21):

```
pandoc guide-body.md --metadata-file=metadata.yaml -f gfm+smart -t latex --standalone \
  --toc --toc-depth=2 --number-sections --shift-heading-level-by=-1 \
  --lua-filter widths.lua --lua-filter inline-code.lua --lua-filter code-blocks.lua \
  -H header.tex -o destructuring-guide.tex
latexmk -xelatex -shell-escape -interaction=nonstopmode -halt-on-error destructuring-guide.tex
```

`guide-body.md` is `README.md` from "Bonuses claimed" on (the name and student number are on
the title page instead). `-shell-escape` is needed because `minted` runs Pygments to colour
the code.

**How it is typeset:**

- Code blocks use the **minted** package (Pygments highlighting for `js`, `jsx`, `ts`,
  `tsx`; program output as plain text), all in the same style: small monospace, a grey rule
  on the left, long lines wrapped with a ↪ mark.
- Tables are real `longtable` tables with `booktabs` rules. `widths.lua` gives each column a
  width from its content, so no table runs off the page.
- The contents page is generated by `--toc` and every entry is a link (`hyperref`), as are
  the URLs.
- The result compiles with **no errors and no overfull boxes** (checked in
  `destructuring-guide.log`): 22 pages, A4.

**Why minted and not listings:** with XeLaTeX, `listings` put the Turkish letters ş, ı and ğ
in the wrong place inside code (`'Beşiktaş'` came out as `'şşBeikta'`), because it does not
handle characters above U+00FF. ö and ü were fine. `minted` passes the code to Pygments and
prints it as it is, so `'Beşiktaş'` and `'Kadıköy'` are correct.

## Bonus 2: Depth

Bonus 2: Depth

Four directions, each with my own code and the real output. The JavaScript experiments are
in `js/depth.mjs`, the type-level ones in `ts/depth.ts`; both run with `npm run depth`
(not part of `npm run all`, so `output.txt` stays the output of the required part).

### D1. What an array pattern really calls on the value

I wrote an iterable "spy" that logs every call the pattern makes on it:

```js
function spy(label, items) {
  return {
    [Symbol.iterator]() {
      console.log(`  ${label}: [Symbol.iterator]() called`)
      let i = 0
      return {
        next() { /* logs, then returns { done, value } */ },
        return() { console.log(`  ${label}: return() called (the pattern stopped early)`) /* ... */ },
      }
    },
  }
}
const [a1, b1] = spy('stops', ['Kadıköy', 'Üsküdar', 'Adalar'])
const [a2, b2] = spy('short', ['Kadıköy'])
const [first, ...rest] = spy('rest', ['Kadıköy', 'Üsküdar', 'Adalar'])
const [] = spy('empty', ['Kadıköy'])
```

```
D1 two variables from three items:
  stops: [Symbol.iterator]() called
  stops: next() -> "Kadıköy"
  stops: next() -> "Üsküdar"
  stops: return() called (the pattern stopped early)
D1 result: Kadıköy Üsküdar
D1 two variables from one item:
  short: [Symbol.iterator]() called
  short: next() -> "Kadıköy"
  short: next() -> done
D1 result: Kadıköy undefined
D1 rest reads everything:
  rest: [Symbol.iterator]() called
  rest: next() -> "Kadıköy"
  rest: next() -> "Üsküdar"
  rest: next() -> "Adalar"
  rest: next() -> done
D1 result: Kadıköy [ 'Üsküdar', 'Adalar' ]
D1 empty pattern:
  empty: [Symbol.iterator]() called
  empty: return() called (the pattern stopped early)
```

**Why:** an array pattern never uses `[0]`, `[1]` or `length`. It calls
`value[Symbol.iterator]()` once, then `next()` once per element in the pattern. If the
pattern is finished while the iterator is not (`done` was never seen), it calls `return()`
to close it, so a generator or a file reader can clean up. With one item too few, `next()`
says `done` and the variable becomes `undefined`, and nothing needs closing. A rest element
keeps calling `next()` until `done`. Even `const [] = x` asks for an iterator and closes it
at once. This is also why pitfall 6 (`{ 0: 'a', length: 1 }`) throws "is not iterable": an
array-like object has no `Symbol.iterator`.

So any iterable works, not only arrays:

```js
const [c1, c2, ...cRest] = 'Dönence'
const [emoji] = '🚢 ferry'
const [s1, s2] = new Set(['OOP', 'Calculus', 'OOP'])
const [[day, room]] = new Map([['Monday', 'A-204']])
function* countdown() { console.log('  generator: started'); yield 3; yield 2; console.log('  generator: this line never runs'); yield 1 }
const [g1, g2] = countdown()
function* forever() { let n = 1; while (true) yield n++ }
const [n1, n2, n3] = forever()
const { 0: zero, length, [length - 1]: last } = ['Eminönü', 'Karaköy', 'Kadıköy']
```

```
D1 string: D ö [ 'n', 'e', 'n', 'c', 'e' ]
D1 emoji (one code point, not two halves): 🚢 | [0] gives: "\ud83d"
D1 Set (no duplicates, insertion order): OOP Calculus
D1 Map (each item is a [key, value] pair): Monday A-204
  generator: started
D1 generator (lazy, only two values made): 3 2
D1 infinite generator, first three: 1 2 3
D1 object pattern on an array: Eminönü 3 Kadıköy
```

- A string iterates by **code points**, so `[emoji]` gets the whole ship, while `'🚢'[0]`
  is only half of it (one UTF-16 unit, `\ud83d`). Here destructuring is *more correct* than
  indexing.
- A `Map` gives `[key, value]` pairs, so a nested pattern `[[day, room]]` takes the first pair
  apart (this is form 12 without the loop).
- The generator never prints "this line never runs": after two values the pattern calls
  `return()`, so the generator stops at its second `yield`. That is also why
  `[n1, n2, n3] = forever()` does not hang.
- An **object** pattern does not iterate at all; it reads properties. On an array it can read
  `0`, `length`, and even the last item with a computed key (`[length - 1]`), because
  `length` is already a variable when the next property is read.

### D2. When defaults are evaluated, and in which order

```js
const { x = expensiveDefault('x'), y = expensiveDefault('y') } = { x: 'given' }
const [start = 9, end = start + 1, label = `${start}-${end}`] = []
eval('const [p = q, q = 1] = []')
const target = { set a(v) { log.push(`set a = ${v}`) }, set b(v) { log.push(`set b = ${v}`) } }
;[target.a, target.b] = (log.push('right side evaluated'), [1, 2])
function addTask(title, createdAt = (calls++, Date.now())) { return { title, createdAt } }
addTask('a'); addTask('b')
```

```
D2 default is computed only when needed:
  default for y computed (call 1)
D2 result: given y-default | calls: 1
D2 left to right, and a later default can use an earlier variable:
D2 result: 9 10 9-10
D2 earlier default uses a later variable: ReferenceError - Cannot access 'q' before initialization
D2 the right side is evaluated first, then targets left to right:
D2 result: [ 'right side evaluated', 'set a = 1', 'set b = 2' ]
D2 parameter default evaluated per call: 2 times
```

**Why:**

- A default is an expression that runs **only when the value is `undefined`**. `x` was given,
  so `expensiveDefault('x')` never ran (one call, not two). A default with a side effect or a
  cost is therefore safe to write: it costs nothing when the value is there.
- The elements are handled **left to right**, and each variable exists as soon as its element
  is done, so `end = start + 1` can use `start`. The other way round, `p = q` reads `q` while
  `q` is still in its temporal dead zone (declared by `const`, not yet initialised), which is
  the same `ReferenceError` as in my own log entry 5.
- In a destructuring **assignment** the right side is evaluated first; then each target is
  assigned in order (the setters log `a` before `b`).
- A **parameter** default runs on every call that leaves the argument out (two calls, two
  evaluations). This is the opposite of the `Date.now()` problem in Assignment 5's schema,
  where a JavaScript default written in the table definition runs only once.

### D3. Destructuring in other places

```js
try { JSON.parse('{ broken') } catch ({ name, message }) { /* ... */ }
for (const key in course) keysIn.push(key)
for (const [key, value] of Object.entries(course)) pairsOf.push(`${key}=${value}`)
for (const [k, v] in { ab: 1 }) console.log(/* ... */, k, v)
;({ title: box.heading, tags: [arr[0], ...arr[1]] } = { title: 'Dune', tags: ['sf', 'classic', 'desert'] })
;[pair.left, pair.right] = [pair.right, pair.left]
const { basename, extname: ext = () => '?' } = await import('node:path')
await asModule("import { basename: base } from 'node:path'")
await asModule("import { basename as base } from 'node:path'; export const r = base('/x/y.md')")
```

```
D3 catch ({ name, message }): SyntaxError - Expected property name or '}' in JSON at position 2 (line 1 column 3)
D3 for...in gives keys: [ 'code', 'credits' ] | for...of + entries gives pairs: [ 'code=SEN0415', 'credits=6' ]
D3 for...in pattern on the key "ab": a b
D3 targets are properties and array slots: { heading: 'Dune' } [ 'sf', [ 'classic', 'desert' ] ]
D3 swap two properties: { left: 'Üsküdar', right: 'Kadıköy' }
D3 destructuring the module object: README.md .md
D3 import { a: b }: SyntaxError - Unexpected token ':'
D3 import { a as b } works: y.md
```

- `catch ({ name, message })` is form 11 for the error object: the catch clause is a
  parameter, so a pattern is allowed there.
- **`for...in` against `for...of`.** `for...in` gives the **keys** (strings), so a pattern on
  it destructures the key string itself: `[k, v]` on the key `"ab"` gives `a` and `b`, which
  is almost never what you want. The pairs come from `for...of` over `Object.entries`.
- An assignment pattern accepts **any assignment target**, not only variable names: a
  property (`box.heading`), an array slot (`arr[0]`), and a rest into a slot (`...arr[1]`
  received the array `[ 'classic', 'desert' ]`). That is why form 3's swap also works on two
  properties.
- `import { basename } from ...` **looks like** destructuring but is a different syntax:
  renaming uses `as`, and the destructuring colon is a `SyntaxError`. I loaded both versions
  as small modules from `data:` URLs to see the real error. Destructuring the **module object**
  from a dynamic `import()` is real destructuring, so there a default (`= () => '?'`) and a
  colon rename are allowed.

### D4. TypeScript: taking types apart with `infer`

A pattern takes a value apart; a conditional type with `infer` takes a **type** apart in the
same shape (`ts/depth.ts`):

```ts
type First<T extends readonly unknown[]> = T extends readonly [infer F, ...unknown[]] ? F : undefined
type Rest<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : []
type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : undefined
type Trip = [stop: string, minutes: number, ferry: boolean]

const check1: Equal<First<Trip>, string> = true
const check2: Equal<Rest<Trip>, [minutes: number, ferry: boolean]> = true
const check3: Equal<Last<Trip>, boolean> = true
const check4: Equal<First<[]>, undefined> = true

const [stop, ...others] = trip          // the value version
const firstStop: First<Trip> = stop     // the type version agrees
const otherParts: Rest<Trip> = others

type TimerArgs = Parameters<typeof startTimer>   // [{ subject: string; minutes?: number }]
type TimerOptions = First<TimerArgs>
```

```
D4 First/Rest/Last of Trip compile: true true true true
D4 value and type agree: Kadıköy [ 25, true ]
D4 PropType<Book, "tags"> is string[]: true
D4 options type taken from the function itself: Calculus: 25 min true
D4 call with [{"subject":"OOP","minutes":50}]
D4 result: OOP: 50 min
```

- `Equal<A, B>` is `true` only when the two types are identical, so each `const checkN = true`
  line is a test that runs in the compiler: `npm run check` passes only if all of them hold.
  To be sure the check is not always `true`, I added a wrong one as **E17** in
  `errors/types-errors.ts` (`Equal<Last<Trip>, string>`), and `npm run errors` rejects it:
  `Type 'true' is not assignable to type 'false'.`
- **`Last` works at the type level but not at the value level.** `const [...earlier, last]`
  is a `SyntaxError` (Bonus 3, case 8), but the tuple type `[...unknown[], infer L]` is fine,
  because a tuple *type* may have its rest element in the middle.
- `Parameters<typeof startTimer>` gives the parameter list as a tuple, and `First<...>` then
  takes the options object type out of it, so the options type comes from the function and
  cannot drift away from it. `logged(fn)` uses the same idea with a rest parameter
  `(...args: A)` to forward any call with exactly the same argument types.

## Bonus 3: Real code

Bonus 3: Real code

Sources:

- **Task Manager** from Assignment 3: https://github.com/eesmaeroz/assignment3 (`src/`).
- **esbuild 0.28.2**, installed in this project's `node_modules/esbuild` (it is the package
  whose install script npm skipped, see log entry 2).
- **shadcn/ui**, an open-source React component library:
  https://github.com/shadcn-ui/ui, folder `apps/v4/registry/new-york-v4/ui`, commit `e62c943`.

### Case 1: `const [state, dispatch] = useReducer(...)`

`assignment3/src/App.tsx:69`

```ts
const [state, dispatch] = useReducer(taskReducer, initialState)
```

**Form 1** (values by position from a function's tuple return). Without destructuring:

```ts
const pair = useReducer(taskReducer, initialState)
const state = pair[0]
const dispatch = pair[1]
```

React returns a pair because the caller should choose the names. With an object
(`{ state, dispatch }`) every component would have to rename (form 6) to get a second
reducer; with a tuple I just write other names in the brackets.

### Case 2: `TaskRow({ task, onNext, onDelete })`, React props

`assignment3/src/TaskRow.tsx:5`

```tsx
type TaskRowProps = { task: Task; onNext: () => void; onDelete: () => void }
export default function TaskRow({ task, onNext, onDelete }: TaskRowProps) {
```

**Form 11 with form 5 inside** (a pattern in the parameter, properties by name), and the
type after the whole pattern (T1). Without destructuring:

```tsx
export default function TaskRow(props: TaskRowProps) {
  const task = props.task
  const onNext = props.onNext
  const onDelete = props.onDelete
```

**Props and children here:** `task`, `onNext` and `onDelete` are props (attributes in
`<TaskRow task={t} onNext={...} onDelete={...} />`). There is **no children**: the type has
no `children`, so `<TaskRow ...>text</TaskRow>` would be a compile error (like E9), and the
row is always used as a self-closing tag.

### Case 3: `FilterBar({ active, counts, dispatch })`

`assignment3/src/App.tsx:34`

```tsx
function FilterBar({ active, counts, dispatch }: FilterBarProps) {
```

Again **form 11 + form 5**. All three are props, there is no children. `dispatch` is
passed down from case 1, so the same function is taken out of a tuple in `App` (form 1)
and out of a props object in `FilterBar` (form 5).

### Case 4: `const { pkg, subpath, isWASM } = ...` in esbuild

`node_modules/esbuild/install.js:266`

```js
const { pkg, subpath, isWASM } = pkgAndSubpathForCurrentPlatform();
```

**Form 5** on the return value of a function. Without destructuring:

```js
const result = pkgAndSubpathForCurrentPlatform();
const pkg = result.pkg;
const subpath = result.subpath;
const isWASM = result.isWASM;
```

This is the "return several values" idea of form 1, but with an object, because three
values of different meaning are easy to mix up by position (pitfall 5). Here names are
safer than positions.

### Case 5: `let [major, minor] = process.versions.node.split(".")` in esbuild

`node_modules/esbuild/lib/main.js:2093`

```js
let [major, minor] = process.versions.node.split(".");
if (+major < 12 || +major === 12 && +minor < 17 || ...
```

**Form 1** on an array from `split`, with the third item (the patch version) ignored.
Without destructuring: `const parts = ...split("."); let major = parts[0]; let minor = parts[1];`

Watch out: the values are **strings** (`split` gives `[ '22', '23', '4' ]` on Node 22.23.4),
which is why esbuild writes `+major` everywhere to turn them into numbers. In TypeScript
with `noUncheckedIndexedAccess` both would be `string | undefined` (T3).

### Case 6: `for (const [key, value] of [...])` in esbuild

`node_modules/esbuild/lib/main.js:1753`

```js
for (const [key, value] of [["errors", errors], ["warnings", warnings]]) {
  Object.defineProperty(error, key, { ... value ... })
```

**Form 12** (pattern in a loop), over a hand-written array of pairs instead of
`Object.entries`. Without destructuring: `for (const pair of list) { const key = pair[0]; const value = pair[1]; ... }`.
It gives the same pairs as `Object.entries({ errors, warnings })`.

### Case 7: `Card({ className, ...props })` in shadcn/ui, React props and children

`apps/v4/registry/new-york-v4/ui/card.tsx:4`

```tsx
function Card({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      className={cn("flex flex-col gap-6 rounded-xl border ...", className)}
      {...props}
    />
  )
}
```

**Form 11 + form 8** (rest in the parameter), then **spread** onto the DOM element, the
exact pattern of P4, typed with `ComponentProps<'div'>` like P7.

**Props and children here:** only `className` is taken out by name. **children is never
named**, but it still works: in `<Card>Hello</Card>` the content arrives as
`props.children`, the rest pattern collects it into `props` together with `id`,
`onClick` and the rest, and `{...props}` puts it back on the `<div>` as its `children`.
This is P2 in real code: children is only a prop, so it travels like any other prop.

`className` is taken out because it must be **merged** with the card's own classes; if it
stayed in `props`, the spread (written after `className=`) would overwrite the card's
classes (the "after the spread wins" rule from P4).

### Case 8: where destructuring makes the code worse (Undo in Assignment 3)

`assignment3/src/taskReducer.ts:71`

```ts
case 'undo': {
  if (state.past.length === 0) return state
  return {
    ...state,
    tasks: state.past[state.past.length - 1],
    past: state.past.slice(0, -1),
  }
}
```

The code needs the **last** item and **everything before it**. The pattern that looks
natural is not allowed:

```js
const [...earlier, last] = state.past
```

```
SyntaxError: Rest element must be last element
```

A rest element can only be at the end. A version that does work uses a computed key
(form 10) with `length`:

```js
const { length, [length - 1]: last } = state.past
```

It runs (on `[['a'], ['b'], ['c']]` it gives `[ 'c' ]`), but it is much harder to read than
`state.past[state.past.length - 1]`, and it creates a variable `length` for nothing. So
here destructuring makes the code **worse**, and the plain index (or `state.past.at(-1)`)
is the better choice. Destructuring is good at "the first few and the rest", not at
"the last one".

## Bonus 4: Git repository

Bonus 4: Git repository, https://github.com/eesmaeroz/assignment4-destructuring

- `.gitignore` leaves out `node_modules` (and `dist`).
- It runs after a fresh clone:

  ```
  git clone https://github.com/eesmaeroz/assignment4-destructuring.git
  cd assignment4-destructuring
  npm install
  npm run all
  ```

- The history is in steps: project setup, JavaScript examples, TypeScript examples and
  compiler errors, the field guide with the real output, then this section.

## My own log

### 1. `npm install` could not find package.json
I ran `npm install` and got:

```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory,
open 'C:\Users\eesma\Desktop\assignment4\package.json'
```

The zip already had an `assignment4` folder in it. When I opened it on my computer, npm
looked in the wrong folder. When I went inside with `cd`, it was fixed.

### 2. npm did not run esbuild's install script
`npm install` finished, but printed:

```
npm warn install-scripts 1 package has install scripts not yet covered by allowScripts:
npm warn install-scripts   esbuild@0.28.2 (postinstall: node install.js)
```

My npm does not run install scripts of packages until I approve them. `tsx` uses esbuild,
so I ran `npm run all` to check, and it still worked. Not about destructuring, but it was
the first thing that went wrong.

### 3. Removing `= {}` from a parameter pattern crashed the whole file
In `js/params.mjs` I removed `= {}` from `function startTimer({ subject, minutes = 25,
breakMinutes = 5 } = {})` and ran `node js/params.mjs`:

```
form 11: Calculus: 50 min work, 5 min break
TypeError: Cannot destructure property 'subject' of 'undefined' as it is undefined.
    at startTimer (.../js/params.mjs:6:23)
    at .../js/params.mjs:10:39
```

The function asks me for something (like a box) and says it will take `subject` and
`minutes` out of it. In the `startTimer()` call the box never comes, and when it tries to
open a box that does not exist, the program crashes right away. But `= {}` says: if the box
does not come, take it as an empty box. And `minutes = 25` means: the box is there, but if
there is nothing called `minutes` inside, use 25. So we are using two different plans.

### 4. React warnings were in my terminal but not in output.txt
When I ran `npm run all` in the terminal, some lines appeared between my output, for example:

```
Functions are not valid as a React child. This may happen if you return children
instead of <children /> from render. ...
```

React writes these warnings with `console.error`, which goes to stderr. `>` only
redirects stdout, so I had to add `2> output-stderr.txt` to keep them.

### 5. Removing the `;` before the swap gave a different error than I had in pitfall 7
In `js/arrays.mjs` I removed the `;` at the start of the swap line (form 3) and ran
`node js/arrays.mjs`:

```
[morningLine, eveningLine] = [eveningLine, morningLine]
              ^
ReferenceError: Cannot access 'eveningLine' before initialization
    at .../js/arrays.mjs:41:15
```

The line before it is `let eveningLine = 'Üsküdar'`, with no semicolon. JavaScript does
not insert one before `[`, so the two lines are read as one:

```js
let eveningLine = 'Üsküdar'[morningLine, eveningLine] = [eveningLine, morningLine]
```

So `eveningLine` is read inside its own `let` declaration, before it has a value, and that
is a ReferenceError. In pitfall 7 the same mistake gave a SyntaxError (`Invalid left-hand
side in assignment`), because there the line before ended with `m + n`, and `m + n[...] = ...`
cannot be parsed at all. Here `'Üsküdar'[...]` is a valid thing to assign to, so the file
parses and fails only when it runs. What I learned: the missing `;` does not have one fixed
error; the error depends on what the line before ends with. That is why I always start a
swap line with `;`.
