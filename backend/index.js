const express = require("express");
const cors = require('cors');
require("./database/dbConfig.js");

const router = require('./routes/routes.js');

const app = express();
const corsOptions ={
    origin:'*', 
    credentials:true,            
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.use('/', router);

app.listen(8000, () => {
    console.log("Server started on port 8000");
});