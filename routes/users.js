const express = require('express')
const jwt = require('../config/jwt')
const User = require('../model/user.model')
let router = express.Router()

// router.use(function (req, res, next) {
//     if (!req.headers.authorization) {
//         return res.status(403).json({ error: 'No credentials sent!' });
//     }
//     next();
// });

function auth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: 'No credentials sent!' });
    }
    next();
};

//SETAR UM DADO NO BANCO ATRAVÉS DO /USERS
router.post('/', auth, (req, res) => {
    console.log('METODO POST')
    console.log(req.body)
    //VALIDAÇÃO DO QUE PRECISA CADASTRAR
    let user = new User(req.body)
    user.save()
        .then((user) => {
            res.status(200).json({
                user: user
            })
        }).catch(err => {
            res.status(500).json({
                message: err.message || 'Houston, we have a problem'
            })
        })
    if (!req.body.email) {
        return res.status(400).json({
            message: 'Precisa setar o usuário véi'
        })
    }
})

//METODO GET PARA LISTAR TODOS OS ENVOLVIDOS
router.get('/listAll', auth, (req, res) => {
    console.log('auth:' + req.headers.authorization)
    User.find()
        .then(users => {
            res.status(200).json(users)
        }).catch(err => {
            res.status(500).json({
                message: err.message || 'Houston, we have a problem'
            })
        })
})

//BUSCAR PELO ID
router.get('/:_id', auth, (req, res) => {
    let obj = {
        _id: req.params._id
    }
    User.findOne(obj)
        .then(user => {
            if (!user) {
                return res.status(404).json({
                    message: 'Usuário não encontrado, procura direito'
                })
            }
            res.status(200).json(user)
        }).catch(err => {
            res.status(500).json({
                message: err.message || 'Houston, we have a problem'
            })
        })
})

//ATUALIZAR DADOS ATRAVES DO ID (NO ESCOPO DO JSON)
router.put('/:_id', auth, (req, res) => {
    let obj = {
        _id: req.params._id
    }
    User.findByIdAndUpdate(obj, req.body, { new: true }, (err, user) => {
        if (err) {
            return res.status(500).json({
                message: err.message || 'Houston, we have a problem'
            })
        }
        return res.status(200).json(user);
    })
})

//DELETAR USUÁRIO ATRAVÉS DO E-MAIL (NO CORPO DO JSON)
// router.delete('/', (req, res) => {
//     let obj = {
//         email: req.body.email
//     }
//     User.findOneAndDelete(obj, req.body)
//     .then(user => {
//         if(!user){
//             res.status(404).json({
//                 message: 'Usuário não encontrado, procura direito'
//             })
//         }
//         res.status(200).json(user)
//     }).catch(err => {
//         res.status(500).json({
//             message: err.message || 'Houston, we have a problem'
//         })
//     })
// })

//DELETAR USUÁRIO ATRAVÉS DO E-MAIL (NO CORPO DO JSON)
router.delete('/:_id', auth, (req, res) => {
    let obj = {
        _id: req.params._id
    }
    User.findOneAndDelete(obj)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: 'Usuário não encontrado, procura direito'
                })
            }
            res.status(200).json(user)
        }).catch(err => {
            res.status(500).json({
                message: err.message || 'Houston, we have a problem'
            })
        })
})

//LOGIN
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email, password })
        const token = jwt.sign({ user: user._id })
        if (!user) {
            return res.send(401)
        }
        res.json({ token: token })
    } catch (err) {
        res.json({
            message: err.message || 'Houston, we have a problem'
        })
    }
})

module.exports = router