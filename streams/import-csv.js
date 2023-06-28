import fs from 'node:fs'
import { parse } from 'csv-parse'

const csvPath = new URL('./fs_read.csv', import.meta.url)

const stream = fs.createReadStream(csvPath)

const csvParser = parse({
  delimiter: ',',
  skipEmptyLines: true,
  fromLine: 2, // skip the header line
})

export async function run() {
  const rowsParse = stream.pipe(csvParser)

  for await (const row of rowsParse) {
    const [title, description] = row

    const jsonRow = JSON.stringify({ title, description })

    await fetch('http://localhost:3333/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: jsonRow,
    }).catch((err) => console.error(err))
  }

  // Uncomment this line to see the import working in slow motion (open the db.json)
  // await wait(1000)
}

run()

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
