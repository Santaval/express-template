const mysql = require('mysql')
const {database} = require('./keys')
const {promisify} = require('util')



const pool = mysql.createPool(database)

pool.getConnection((err, connection) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){console.error('Connection closed')}
        if(err.code === 'ERR_CON_COUNT_ERROR'){console.error('Many connections ')}
        if(err.code === 'ENCONNREFUSE'){console.error('REFUSE CONECTION')}


    } 

    if(connection) connection.release()
        console.log('DB enable')
        return
    
})


pool.query = promisify(pool.query)



module.exports = pool