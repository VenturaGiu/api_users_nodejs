const express = require('express')
const parser = require('body-parser')
const config = require('./config')
const mongoose = require('mongoose')
const cors = require('cors');

//INICIAR CONEXÃO COM O MONGODB
mongoose.Promise = global.Promise
mongoose.connect(config.dbUrl, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
}).then(() =>{
    console.log(`Banco conectado em: ${config.dbUrl}`)
})

//INICIALIZAR O EXPRESS
const app = express()
//FAZER O PARSE DE REQUISIÇÕES
app.use(parser.json())
app.use(cors());
const usersRoute = require('./routes/users')
app.use('/users', usersRoute)

app.get('/', (req, res) => {
    res.json({
        message: 'Rota raiz, vai pa ota (/users)'
    })
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`API Server running on PORT: ${PORT}`)
})