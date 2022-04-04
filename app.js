import express from 'express'
import path from 'path'

const app = express()

const PORT = process.env.port
let state = false

app.use(express.json())
app.listen(PORT || 8000)

app.get('/', function (_, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api', (_, res) => res.send({ state: state }))
app.post('/api', (req, res) => {
    state = req.body.state
    res.send({ state: state })
})