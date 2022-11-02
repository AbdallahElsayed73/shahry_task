const express = require('express')
const app = express()
const port = 3000


// defining the middleware functions to parse the body of the requests
app.use(express.json());
app.use(express.urlencoded({extended : false}));

app.use('/api/national_id', require('./routes/api/national_id'))

app.listen(port, ()=> console.log(`app listening to port ${port}`))


