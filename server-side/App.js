const express = require('express');
const cors = require('cors')
const port = 5000
const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())


app.post("/",(req, res) => {
    const {name} = req.body
    console.log(`your name is ${name}`)
})

app.listen(port,()=>{
    console.log(`server running on port: ${port}`)
})