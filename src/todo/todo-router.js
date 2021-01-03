const express = require('express')
const xss = require('xss')
const TodoService = require('./todo-service')


const todoRouter = express.Router()
const jsonParser = express.json()

const serializeTodo = todo => ({
  id: todo.id,
  title: xss(todo.title),
  completed: todo.completed
})

todoRouter
.route('/me')
.get((req, res, next) => {
  res.json({ok: true});
  next()
})

todoRouter
.route('/todos')
.get((req, res, next) => {
   TodoService.getTodos(req.app.get('db'))
   .then(data => {
     res.json(data)
     next()
   })
   .catch(next)
})
.post(jsonParser,(req, res, next) => {
  const { title, completed } = req.body
  const todoToUpdate = { title, completed }

  const numberOfValues = Object.values(todoToUpdate).filter(Boolean).length
  if (numberOfValues === 0)
    return res.status(400).json({
      error: {
        message: `Request body must content either 'title' or 'completed'`
      }
   })

   TodoService.insertTodo(
    req.app.get('db'),
    todoToUpdate
  )
    .then(updatedTodo => {
      res.status(201)
      .location(`/v1/todos/${updatedTodo.id}`)
      .json(serializeTodo(updatedTodo))
    })
    .catch(next)
})

todoRouter
.route('/todos/:todo_id')
.all((req, res, next) => {
  if(isNaN(parseInt(req.params.todo_id))) {
    return res.status(404).json({
      error: { message: `Invalid id` }
    })
  }
  TodoService.getTodoById(
    req.app.get('db'),
    req.params.todo_id
  )
    .then(todo => {
      if (!todo) {
        return res.status(404).json({
          error: { message: `Todo doesn't exist` }
        })
      }
      res.todo = todo
      next()
    })
    .catch(next)
})
.get((req, res, next) => {
  res.json(serializeTodo(res.todo))
})
.delete((req, res, next) => {
  TodoService.deleteTodo(
    req.app.get('db'),
    req.params.todo_id
  )
    .then(numRowsAffected => {
      res.status(204).end()
    })
    .catch(next)
})
.patch(jsonParser, (req, res, next) => {
  const { title, completed } = req.body
  const todoToUpdate = { title, completed }

  const numberOfValues = Object.values(todoToUpdate).filter(Boolean).length
  if (numberOfValues === 0)
    return res.status(400).json({
      error: {
        message: `Request body must content either 'title' or 'completed'`
      }
    })

  TodoService.updateTodo(
    req.app.get('db'),
    req.params.todo_id,
    todoToUpdate
  )
    .then(updatedTodo => {
      res.status(200).json(serializeTodo(updatedTodo[0]))
    })
    .catch(next)
})


module.exports = todoRouter