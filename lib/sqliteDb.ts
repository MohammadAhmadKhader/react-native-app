import { DbErrorLog } from '@/app/types/types';
import * as SQLite from 'expo-sqlite';

export const dbName = "localDb.db"

openDatabase().then(async (db)=>{
    if(!db){
        throw new Error("Database connected was not established")
    }
    
    closeDb(db)
}).catch((err)=>{
    logDbError(err)
})


export async function createDB(db : SQLite.SQLiteDatabase){
    try {
        const row = await db.getFirstAsync<{name:string}>("SELECT name FROM sqlite_master WHERE type='table' and name='Logs'")
        if(!row){
            console.log("Database is not initiated!")
            console.log("Creating database ...")
            await db.execAsync(`
            CREATE TABLE IF NOT EXISTS Logs 
            (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                message TEXT,
                code INTEGER
            );`)
            return;
        }

    } catch (error) {
        logDbError(error)
    }
}

function logDbError(error:any){
    console.error(`SQL Error: ${error.message} with code: ${error.code}`)
}

async function openDatabase(){
    try {
        const db = await SQLite.openDatabaseAsync(dbName)
        
        return db
    } catch (error :any) {
        logDbError(error)
        throw new Error(error.message)
    }
}

async function closeDb(database : SQLite.SQLiteDatabase){
    try {
        await database.closeAsync()
    } catch (error : any) {
        logDbError(error)
        throw new Error(error.message)
    }
}

export async function logErrorToLocalDb(error:any){
    try {
        const db = await openDatabase()
        
        await AddLogAsync(db,[error.message,error.code])
        
        closeDb(db)
    } catch (error : any) {
        logDbError(error)
    }
}

async function AddLogAsync(db: SQLite.SQLiteDatabase,params:[message:string,code:number]){
    try {
        const statement = await db.prepareAsync(
            'INSERT INTO Logs (message, code) VALUES ($message, $code)'
        );
        const result = await statement.executeAsync<DbErrorLog>(params);

        return result;
    } catch (error : any) {
        throw new Error(error.message);
    }
}

export async function fetchAllErrorsFromDb(db: SQLite.SQLiteDatabase){
    try {
        const statement = await db.getAllAsync<DbErrorLog>('SELECT * FROM Logs');
        return statement;
    } catch (error : any) {
        throw new Error(error.message);
    }
}