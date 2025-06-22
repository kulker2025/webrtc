import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import fs from 'fs'
import http from 'http'               // <-- importáld be
import { Server } from 'socket.io'   // <-- importáld be
import router from './routes/api.js'
import { readJson } from '../tools/readjson.js'

const config = await readJson('config/default.json')

const app = express()
const PORT = config.app.port || 8000

const logfile = 'access.log'
const accessLogStream = fs.createWriteStream(logfile, { flags: 'a' })

app.use(morgan('dev', { stream: accessLogStream }))
app.use(cors())
app.use(express.json())
app.use('/api', router)

// HTTP szerver az express app köré
const server = http.createServer(app)

// Socket.IO szerver inicializálása
const io = new Server(server, {
  cors: {
    origin: '*',    // Fejlesztéshez, később korlátozd!
  }
})

// Socket.IO események
io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (roomId) => {
    socket.join(roomId)
    socket.to(roomId).emit('user-connected', socket.id)
  })

  socket.on('signal', ({ roomId, data }) => {
    socket.to(roomId).emit('signal', { id: socket.id, data })
  })

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

// Indítsd a szervert a http szerveren, nem az express app-on
server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`)
})

