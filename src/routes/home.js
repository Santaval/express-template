
const express = require('express')
const router = express.Router()


//Ruta de inicio de la página

router.get('/',  (req, res)=>{
res.send('Server ok')
})


module.exports = router