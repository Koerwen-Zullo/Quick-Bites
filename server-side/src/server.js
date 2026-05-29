const express = require('express');
const cors = require('cors')
const port = 5000
const app = express();

app.use(cors())
app.use(express.urlencoded({ extended: false}))
app.use(express.json())


app.post("/", async (req, res) => {
    const { name, password } = req.body

    if (!name || !password) {
        return res.status(400).json({
            message: "error empty name or password field"
        })
    }
    return res.status(200).json({
        message: `your name is ${name} 
    and your password is ${password}`
    })
})

app.listen(port, () =>{
    console.log(`server running on port: ${port}`)
})