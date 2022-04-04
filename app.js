import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import webpush from 'web-push'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()

const PORT = process.env.port || 8000

const publicVapidKey = 'BB4HYa1ZLggzGWtKTmvfALPW9sWuFhrjFNZ-5g7YN_Sp5118sWXY5i22GLh5yj9RDVcDTU-x88jNZYBij0HaI84'
const privateVapidKey = 'filYXFJnCKhYcz79gUKSYvzdrEX_-0nIh37uSMDnWxg'

let state = false

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

app.use(express.json())
app.listen(PORT)
console.log('Server started at http://localhost:' + PORT);
app.get('/', function (_, res) {
    res.sendFile(path.join(__dirname, 'client'))
})

app.get('/api', (_, res) => res.send({ state: state }))
app.post('/api', (req, res) => {
    state = req.body.state
    res.send({ state: state })
})

app.post('/subscribe', (req, res) => {
    const subscription = req.body

    res.status(201).json({})

    const payload = JSON.stringify({ title: 'Push Test' })

    webpush.sendNotification(subscription, payload).catch(err => console.log(err))
})