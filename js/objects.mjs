// Meryem Esma Eröz, 2200005798
// Object destructuring (forms 5 to 10). Run with `node js/objects.mjs`.
// My data: books on my reading list.

const book = {
  id: 'b7',
  title: 'Kürk Mantolu Madonna',
  author: { name: 'Sabahattin Ali', born: 1907 },
  pages: 160,
  tags: ['novel', 'classic', 'berlin'],
}

// Form 5: take properties out of an object by name.
let { title, pages } = book
console.log('form 5:', title, pages)
// the same as plain assignments:
let title2 = book.title
let pages2 = book.pages
console.log('form 5 (plain):', title2, pages2)
// a name that is not in the object gives undefined, no error
let { isbn } = book
console.log('form 5 (missing field):', isbn)
// let means I can reassign, and the object does not change
pages = 999
console.log('form 5 (after pages = 999):', pages, book.pages)

// Form 6: rename while you take it, { title: heading }
const { title: heading, pages: pageCount } = book
console.log('form 6:', heading, pageCount)
try {
  // eslint-disable-next-line no-undef
  console.log(pageCountX)
} catch (error) {
  console.log('form 6 (old name is not created, only the new one):', error.message)
}

// Form 7: default values, { status = 'to-read' }
const { status = 'to-read', pages: p7 = 100 } = book
console.log('form 7:', status, p7) // status is missing, pages is there
const { rating = 3 } = { rating: undefined }
const { score = 3 } = { score: null }
console.log('form 7 (undefined vs null):', rating, score)
// rename and default together: source : newName = default
const { language: lang = 'tr' } = book
console.log('form 7 (rename + default):', lang)

// Form 8: rest, { id, ...others }
const { id, ...withoutId } = book
console.log('form 8:', id, withoutId)
console.log('form 8 (rest is a new object):', withoutId === book, Object.keys(withoutId))
console.log('form 8 (but nested values are shared):', withoutId.author === book.author)

// Form 9: nested patterns, and arrays inside objects
const { author: { name: authorName, born }, tags: [firstTag, ...otherTags] } = book
console.log('form 9:', authorName, born, firstTag, otherTags)
try {
  // eslint-disable-next-line no-undef
  console.log(author)
} catch (error) {
  console.log('form 9 (author is only a path, not a variable):', error.message)
}
// nested default protects against a missing middle object
const loanedBook = { title: 'Saatleri Ayarlama Enstitüsü' }
const { borrower: { name: borrowerName } = { name: 'nobody' } } = loanedBook
console.log('form 9 (nested with default):', borrowerName)
try {
  const { borrower: { name } } = loanedBook
  console.log(name)
} catch (error) {
  console.log('form 9 (nested without default):', error.message)
}

// Form 10: computed key, { [key]: value }
function pick(obj, key) {
  const { [key]: value } = obj
  return value
}
console.log('form 10:', pick(book, 'title'), pick(book, 'pages'))
for (const field of ['title', 'pages', 'year']) {
  const { [field]: value = '(none)' } = book
  console.log(`form 10 (${field}):`, value)
}
// a computed key must be renamed: const { [key] } = obj is a syntax error
