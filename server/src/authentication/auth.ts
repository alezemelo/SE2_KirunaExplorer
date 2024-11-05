import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import { User } from "../models/user";
import userDao from "../rcd/daos/userDAO";

// configures local strategy
passport.use(new LocalStrategy(async function verify(username: string, password: string, callback: any) {
    //singleton obj userDao is used
    try {
    const user = await userDao.findByCredentials(username, password);
    if (!user) {
        return callback(null, false, {message: 'Incorrect username or password'});
    }
    return callback(null, user);
    } catch (err) {
        return callback(err);
    }
}));


// (angelo) we may need to change these two in the future if needed
passport.serializeUser(function (user, callback) {
    callback(null, user);
});
passport.deserializeUser(function (user: false | User | null | undefined, callback) {
    return callback(null, user);
});


// authentication middleware
const isLoggedIn = (req: any, res: any, next: any) => {
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({ error: 'Unauthorized' });
}

export { passport, isLoggedIn };