const mongoose = require('mongoose');

const main = async()=> {
    try{
        await mongoose.connect('mongodb://127.0.0.1:27017/To_Do-App',{
            useNewUrlParser: true,
            useUnifiedTopology: true,
          });
        console.log("Database Connetecd Suucessfully");
    }
    catch(error){
        console.log("Error while connecting with database", error);
    }
}
main();

