import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()

const PORT = process.env.port || 8000
let state = false

app.use(express.json())
app.listen(PORT)
console.log('Server started at http://localhost:' + PORT);
app.get('/', function (_, res) {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api', (_, res) => res.send({ state: state }))
app.post('/api', (req, res) => {
    state = req.body.state
    res.send({ state: state })
})