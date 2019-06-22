const express = require('express')
const app = express()
const port = 3000

app.get('*', (req, res) => { res.send("OK"), console.log(req.query, req.url) })

app.listen(port, () => console.log(`All incoming requests will be echoed on port ${port}!`))
