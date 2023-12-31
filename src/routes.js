import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'
import { randomUUID } from 'node:crypto'

const database = new Database()

/**
 * Task:
  - `id` - Identificador único de cada task
  - `title` - Título da task
  - `description` - Descrição detalhada da task
  - `completed_at` - Data de quando a task foi concluída. O valor inicial deve ser `null`
  - `created_at` - Data de quando a task foi criada.
  - `updated_at` - Deve ser sempre alterado para a data de quando a task foi atualizada.
 */

export const routes = [
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body

      if (!title) {
        res
          .writeHead(400)
          .write(JSON.stringify({ message: 'Title não informado' }))
        return res.end()
      }

      if (!description) {
        res
          .writeHead(400)
          .write(JSON.stringify({ message: 'Description não informado' }))
        return res.end()
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: null,
      }

      database.insert('tasks', task)

      return res.writeHead(201).end()
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const searchObject = search
        ? {
            title: search,
            description: search,
          }
        : null

      const tasks = database.select('tasks', searchObject)

      return res.end(JSON.stringify(tasks))
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const { title, description } = req.body

      if (!title) {
        res
          .writeHead(400)
          .write(JSON.stringify({ message: 'Title não informado' }))
        return res.end()
      }

      if (!description) {
        res
          .writeHead(400)
          .write(JSON.stringify({ message: 'Description não informado' }))
        return res.end()
      }

      const newTask = { updated_at: new Date() }

      if (title) {
        newTask.title = title
      }

      if (description) {
        newTask.description = description
      }

      const response = database.update('tasks', id, newTask)

      if (response?.status === 'error') {
        res.writeHead(404).write(JSON.stringify({ message: response.message }))
        return res.end()
      }

      return res.writeHead(204).end()
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const response = database.delete('tasks', id)

      if (response?.status === 'error') {
        res.writeHead(404).write(JSON.stringify({ message: response.message }))
        return res.end()
      }

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      if (!id) {
        res
          .writeHead(400)
          .write(JSON.stringify({ message: 'ID não informado' }))
        return res.end()
      }

      const [task] = database.select('tasks', { id })

      if (!task) {
        res
          .writeHead(400)
          .write(JSON.stringify({ message: 'Task não encontrada' }))
        return res.end()
      }

      const newTask = {}

      if (task.completed_at === null) {
        newTask.completed_at = new Date()
      } else {
        newTask.completed_at = null
      }

      const response = database.update('tasks', id, newTask)

      if (response?.status === 'error') {
        res.writeHead(404).write(JSON.stringify({ message: response.message }))
        return res.end()
      }

      return res.writeHead(204).end()
    },
  },
]
