// Meryem Esma Eröz, 2200005798
// The same four array forms as js/arrays.mjs, now typed. Run with `npx tsx ts/arrays.ts`.

// Form 1: the return type of the function is a tuple, so each position has its own type.
function shortestAndLongest(minutes: number[]): [number, number] {
  return [Math.min(...minutes), Math.max(...minutes)]
}
const ferryMinutes: number[] = [25, 15, 40, 20]
const [shortest, longest] = shortestAndLongest(ferryMinutes) // both: number
console.log('form 1:', shortest, longest)

// a tuple with two DIFFERENT types: a song and its length in seconds
function longestSong(songs: Record<string, number>): [string, number] {
  const [name, seconds] = Object.entries(songs).sort((a, b) => b[1] - a[1])[0] ?? ['none', 0]
  return [name, seconds]
}
const [songName, songSeconds] = longestSong({ 'Dönence': 446, 'Gesi Bağları': 215 })
console.log('form 1 (string, number):', songName, songSeconds.toFixed(0))

// Form 2: skip an item and collect the rest
const playlist: string[] = ['Gesi Bağları', 'Bir Derdim Var', 'Leylim Ley', 'Dönence']
const [, secondSong, ...laterSongs] = playlist
// secondSong: string | undefined (noUncheckedIndexedAccess), laterSongs: string[]
console.log('form 2:', secondSong ?? '(none)', laterSongs)
// with a tuple type the rest is a tuple too
const stops: [string, string, string] = ['Eminönü', 'Karaköy', 'Kadıköy']
const [, middle, ...tail] = stops // middle: string, tail: [string]
console.log('form 2 (tuple):', middle.toUpperCase(), tail)

// Form 3: swap two variables
let morningLine: string = 'Kadıköy'
let eveningLine: string = 'Üsküdar'
;[morningLine, eveningLine] = [eveningLine, morningLine]
console.log('form 3:', morningLine, eveningLine)

// Form 4: default values. The default also removes `undefined` from the type.
const [firstStop = 'Eminönü', secondStop = 'Karaköy'] = ['Kabataş']
// firstStop: string, secondStop: string (no undefined, because of the defaults)
console.log('form 4:', firstStop.length, secondStop.length)
const empty: number[] = []
const [a = 1, b = 2] = empty
console.log('form 4 (from []):', a + b)
