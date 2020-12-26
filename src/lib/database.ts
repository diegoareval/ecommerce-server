import mongoClient from "mongodb";
import chalk from "chalk"
class Database {
    // inicializar conexion con la base de datos
    async init(){
        // extraendo informacion de variables de entorno
        const MONGO_DB = process.env.DATABASE || "mongodb://localhost:27017/ecommerce2020"
        const client =await mongoClient.connect(
            MONGO_DB,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
        const db =client.db()
        if(client.isConnected()){
            console.log("+++++conected++++++++++++++");
            console.log(`Status: ${chalk.greenBright("online")}`);
            console.log(`Database: ${chalk.greenBright(db.databaseName)}`);
        }
        return db
    }
}

export default Database;