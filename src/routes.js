import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const searchObject = search
        ? {
            name: search,
            email: search,
          }
        : null

      const tasks = database.select('tasks', searchObject)

      return res.end(JSON.stringify(tasks))
    },
  },
]
