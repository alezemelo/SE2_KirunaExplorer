import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import { User, UserNoSensitive } from "../models/user";
import { UserType } from "../models/user";
import UserDAO from "../rcd/daos/userDAO";
import express from "express";
import session from "express-session";

class Authenticator {
    private app: express.Application
    private dao: UserDAO

    constructor(app: express.Application) {
        this.app = app;
        this.dao = new UserDAO();
        this.initAuth();
    }

    initAuth() {
        this.app.use(session({
          secret: "se2_07",
          resave: false,
          saveUninitialized: false,
        }));

        this.app.use(passport.initialize()) // Initialize passport
        this.app.use(passport.session()) // Initialize passport session


        const copyThis = this

// configures local strategy
        passport.use(new LocalStrategy(async function verify(username: string, password: string, callback: any) {
            //singleton obj userDao is used
            try {
            const user: UserNoSensitive | null = await copyThis.dao.findByCredentials(username, password);
            if (!user) {
                return callback(null, false, {message: 'Incorrect username or password'});
            }
            return callback(null, user);
            } catch (err) {
                return callback(err);
            }
        }));

        passport.serializeUser((user, callback) => {
            const userInfo = { username: (user as User).username, type: (user as User).type };
            callback(null, userInfo);
        });
        
        passport.deserializeUser(async (userInfo: { username: string, type: string }, callback) => {
            console.log("Deserializing user:", userInfo); // Add this log
            try {
                const user = await this.dao.getUserByUsername(userInfo.username);
                if (!user) {
                    return callback(null, null);
                }
                const userNoSensitive = new UserNoSensitive(user.username, user.type);
                callback(null, userNoSensitive);
            } catch (err) {
                console.error("Error in deserializing user:", err); // Add this log
                callback(err);
            }
        });
    }

    // logs out the user
    logout(req: any, res: any, next: any) {
        return new Promise((resolve, reject) => {
            req.logout((err: any) => {
                if (err) return reject(err); 
                resolve(null);
            });
        });
    } 
    
    // logs in the user
    login(req: any, res: any, next: any): Promise<User> {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', (err: any, user: any, info: any) => {
                if (err) {
                    return reject(err);
                }
                if (!user) {
                    return reject(info);
                }
                req.login(user, (err: any) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(req.user);
                })
            })(req, res, next);
        });       
    }


    // authentication middleware
    isLoggedIn(req: any, res: any, next: any) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.status(401).json({ error: 'Unauthorized' });
    }


    /*
    * Used as a middleware to check authorization for specified user type
    * @param userType - The type of user to check authorization for 
    */
    isUserAuthorized(userType: UserType) {
        return (req: any, res: any, next: any) => {
            if (req.isAuthenticated() && req.user && req.user.type === userType) {
                return next();
            }
            return res.status(403).json({ error: 'Forbidden' });
        }
    }


}



export default Authenticator;