const Pool = require('pg').Pool;



const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "eurovia-m",
    password: "9112",
    port: 5432,
});



module.exports = pool;