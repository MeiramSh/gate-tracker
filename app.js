import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import webpush from 'web-push'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const subscriptions = new Set()

function notifyAll(msg) {
    subscriptions.forEach(element => {
        webpush.sendNotification(element, JSON.stringify({ title: 'Gate Status', message: msg }))
            .catch(err => console.log(err))
    });
}

const app = express()

const PORT = process.env.PORT || 5000

const publicVapidKey = 'BB4HYa1ZLggzGWtKTmvfALPW9sWuFhrjFNZ-5g7YN_Sp5118sWXY5i22GLh5yj9RDVcDTU-x88jNZYBij0HaI84'
const privateVapidKey = 'filYXFJnCKhYcz79gUKSYvzdrEX_-0nIh37uSMDnWxg'

let state = 'true'
webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)

app.use(express.json())
app.use(express.static(path.join(__dirname, 'client')))
app.listen(PORT)
console.log('Server started at http://localhost:' + PORT);

app.get('/api', (_, res) => res.send({ state: state }))
app.post('/api', (req, res) => {
    if (state == req.body.state) {
        console.log(`POST /api ${state} is requested!`)
        res.send({ state: state })
        return
    }
    state = req.body.state
    res.send({ state: state })
    if (state == 'false') {
        notifyAll('The gate is open!')
    } else {
        notifyAll('The gate is closed!')
    }
    console.log(`POST /api ${state} is requested!`)
})

app.post('/subscribe', (req, res) => {
    console.log('Subscription requested')
    subscriptions.add(req.body)
    res.status(201).json({})
    subscriptions.forEach(element => {
        console.log(element)
    })
    console.log('Subscription is done.')
})