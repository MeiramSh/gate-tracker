import express from 'express'

const app = express()
app.use(express.json())

let state = false
let port = process.env.PORT
if (port == null || port == "") {
    port = 8000
}

app.listen(port)

app.get('/', (req, res) => res.send({ state: state }))
app.post('/', (req, res) => {
    state = req.body.state
    res.send({ state: state })
})