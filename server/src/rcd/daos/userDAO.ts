import { User } from "../../models/user";
import db from "../../db/db";
import crypto from 'crypto';

class UserDAO {
    public async findByCredentials(username: string, password: string): Promise<User | null> {
        try {
            let result = await this.getUserByUsername(username);
            if (result === null) {
                return null;
            } 
            const hashedPassword = await new Promise<Buffer>((resolve, reject) => {
                crypto.scrypt(password, result.salt, 32, function (err, derivedKey) {
                    if (err) reject(err);
                    else resolve(derivedKey);
                });
            });
            if (!crypto.timingSafeEqual(Buffer.from(result.hash, 'hex'), hashedPassword)) {
                return null;
            }
            return result;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

   public async getUserByUsername(username: string): Promise<User | null> {
       try {
           const result = await db.select("*").from("users").where({ username });
           if (result.length === 0) {
               return null;
           }
           return new User(result[0].username, result[0].type, result[0].salt, result[0].hash);
       } catch (err) {
           console.error(err);
           throw err;
       }
   }
    
    public async userExists(username: string): Promise<boolean> {
            try {
                const result = await db.select("*").from("users").where({ username });
                return (result.length > 0);
            } catch (err) {
                // some error occured, should correspond to erro code 500
                console.error("Error while checking user existence", err);
                throw err;
            };
    }
}

export default UserDAO;