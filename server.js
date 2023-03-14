const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')

dotenv.config({ path: "./.env" })

const app = express()

const connectDatabase = require('./config/database')
const errorMiddleware = require('./middlewares/errors')
const ErrorHandler = require('./utils/errorHandler')


const auth = require('./routes/auth')
const image = require('./routes/image')

connectDatabase()

app.use(cors())

app.use(express.json())


app.use('/api/v1', auth)
app.use('/api/v1', image)

//handle unhandle routes 
app.all('*', (req, res, next) => {
  next(new ErrorHandler(`${req.originalUrl} route not found!`, 404))
})

//middlewares
app.use(errorMiddleware)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`)
})