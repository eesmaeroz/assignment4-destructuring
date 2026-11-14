// Meryem Esma Eröz, 2200005798
// The same six object forms as js/objects.mjs, now typed. Run with `npx tsx ts/objects.ts`.

type Author = { name: string; born: number }
type Book = {
  id: string
  title: string
  author: Author
  pages: number
  tags: string[]
  status?: 'to-read' | 'reading' | 'done'
  borrower?: { name: string }
}

const book: Book = {
  id: 'b7',
  title: 'Kürk Mantolu Madonna',
  author: { name: 'Sabahattin Ali', born: 1907 },
  pages: 160,
  tags: ['novel', 'classic', 'berlin'],
}

// Form 5: properties by name. The types come from Book, no annotation needed.
let { title, pages } = book // title: string, pages: number
console.log('form 5:', title, pages)
pages = 200 // allowed: let, and the type is number

// Form 6: rename. The type follows the property, the name is new.
const { title: heading, pages: pageCount } = book // heading: string, pageCount: number
console.log('form 6:', heading, pageCount)

// Form 7: default value. status is optional in Book, so without a default it would be
// 'to-read' | 'reading' | 'done' | undefined. With the default the undefined is gone.
const { status = 'to-read' } = book
console.log('form 7:', status)
const { status: rawStatus } = book
console.log('form 7 (no default, may be undefined):', rawStatus)

// Form 8: rest. TypeScript computes the type of the rest: Omit<Book, 'id'>
const { id, ...withoutId } = book
const keys: (keyof typeof withoutId)[] = ['title', 'author', 'pages', 'tags']
console.log('form 8:', id, keys.map((k) => typeof withoutId[k]))

// Form 9: nested patterns, arrays inside objects
const {
  author: { name: authorName, born },
  tags: [firstTag, ...otherTags],
} = book
// firstTag: string | undefined (array index), otherTags: string[]
console.log('form 9:', authorName, born, firstTag ?? '(no tags)', otherTags)
// a nested optional object needs a default, or the compiler refuses
const { borrower: { name: borrowerName } = { name: 'nobody' } } = book
console.log('form 9 (optional nested with default):', borrowerName)

// Form 10: computed key. With a key of type keyof Book the value type is Book[K].
function pick<K extends keyof Book>(obj: Book, key: K): Book[K] {
  const { [key]: value } = obj
  return value
}
const pickedTitle: string = pick(book, 'title')
const pickedPages: number = pick(book, 'pages')
console.log('form 10:', pickedTitle, pickedPages)
