const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}
  
const errorHandler = (error, req, res, next) => {
  console.error(error.message)
  
  // handle different error types here,
  // maybe send errors to sentry.io
  
  next(error)
}

module.exports = {
  unknownEndpoint,
  errorHandler
}