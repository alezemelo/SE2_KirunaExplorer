enum UserType {
    Resident = "resident",
    UrbanDeveloper = "urban_developer",
    UrbanPlanner = "urban_planner",
}

class UserNoSensitive {
    username: string;
    type: UserType;
    constructor(username: string, type: UserType) {
        this.username = username;
        this.type = type;
    }

    getUsername() {
        return this.username
    }
    getType() {
        return this.type
    }

    setUsername(username: string) {
        this.username = username
    }
    setType(type: UserType) {
        this.type = type
    }
}

class User {
    username: string;
    type: UserType;
    salt: string;
    hash: string;

    constructor(username: string, type: UserType, salt: string, hash: string) {
        this.username = username;
        this.type = type;
        this.salt = salt;
        this.hash = hash;
    }
    setType(type: UserType) {
        this.type = type
    }
    setUsername(username: string) {
        this.username = username
    }
    getUsername() {
        return this.username
    }
    getType() {
        return this.type
    }

    setSalt(salt: string) {
        this.salt = salt;
    }
    getSalt() {
        return this.salt;
    }
    getHash() { 
        return this.hash;
    }
}

export {User, UserNoSensitive, UserType}