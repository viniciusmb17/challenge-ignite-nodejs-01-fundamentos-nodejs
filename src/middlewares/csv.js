import fs from 'fs'
import { parse } from 'csv-parse'

import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export async function csv() {
  const parser = parse(
    {
      delimiter: ',',
    },
    async function (_err, data) {
      let firstRow = true
      for await (const chunk of data) {
        if (firstRow) {
          firstRow = false
          continue
        }
        const [title, description] = chunk

        const jsonRow = JSON.stringify({ title, description })

        fetch('http://localhost:3333/tasks', {
          method: 'POST',
          body: jsonRow,
        }).catch((err) => console.error(err))
      }
    },
  )

  fs.createReadStream(__dirname + '/fs_read.csv').pipe(parser)
}

csv()
