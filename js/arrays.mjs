// Meryem Esma Eröz, 2200005798
// Array destructuring (forms 1 to 4). Plain JavaScript: run with `node js/arrays.mjs`.
// My data: ferry trips from Eminönü and a small playlist.

// Form 1: take values out of an array by position (a function returns a "pair").
function shortestAndLongest(minutes) {
  return [Math.min(...minutes), Math.max(...minutes)]
}
const ferryMinutes = [25, 15, 40, 20] // Eminönü to Kadıköy, Üsküdar, Adalar, Beşiktaş
const [shortest, longest] = shortestAndLongest(ferryMinutes)
console.log('form 1:', shortest, longest)
// the same without destructuring:
const pair = shortestAndLongest(ferryMinutes)
const shortest2 = pair[0]
const longest2 = pair[1]
console.log('form 1 (plain):', shortest2, longest2)
// fewer variables than items: extra items are ignored
const [onlyFirst] = shortestAndLongest(ferryMinutes)
console.log('form 1 (only first):', onlyFirst)
// more variables than items: the extra variable is undefined
const [p, q, r] = shortestAndLongest(ferryMinutes)
console.log('form 1 (one too many):', p, q, r)

// Form 2: skip an item and collect the rest, [, second, ...others]
const playlist = ['Gesi Bağları', 'Bir Derdim Var', 'Leylim Ley', 'Dönence', 'Kara Toprak']
const [, secondSong, ...laterSongs] = playlist
console.log('form 2:', secondSong, laterSongs)
// skipping two items needs two commas
const [, , thirdSong] = playlist
console.log('form 2 (skip two):', thirdSong)
// rest when nothing is left is an empty array, never undefined
const [one, ...nothingLeft] = ['Dönence']
console.log('form 2 (empty rest):', one, nothingLeft)
// rest vs spread: same three dots, opposite jobs
const copy = [...playlist] // spread: expands the array into items
console.log('form 2 (spread copy is a new array):', copy === playlist, copy.length)

// Form 3: swap two variables without a temporary, [a, b] = [b, a]
let morningLine = 'Kadıköy'
let eveningLine = 'Üsküdar'
;[morningLine, eveningLine] = [eveningLine, morningLine]
console.log('form 3:', morningLine, eveningLine)
// the long way, one line per step:
let tmp = morningLine
morningLine = eveningLine
eveningLine = tmp
console.log('form 3 (plain, swapped back):', morningLine, eveningLine)
// swap two items inside an array
const queue = ['Adalar', 'Beşiktaş', 'Kadıköy']
;[queue[0], queue[2]] = [queue[2], queue[0]]
console.log('form 3 (inside an array):', queue)

// Form 4: default values, const [a = 1, b = 2] = []
const [firstStop = 'Eminönü', secondStop = 'Karaköy'] = ['Kabataş']
console.log('form 4:', firstStop, secondStop)
const [d1 = 'default'] = [undefined]
const [d2 = 'default'] = [null]
const [d3 = 'default'] = [0]
const [d4 = 'default'] = ['']
console.log('form 4 (undefined, null, 0, empty string):', d1, d2, d3, JSON.stringify(d4))
