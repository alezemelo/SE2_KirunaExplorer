enum UserType {
    Resident = "resident",
    UrbanDeveloper = "urban_developer",
    UrbanPlanner = "urban_planner",
}

class User {
    username: string;
    type: UserType;

    constructor(username: string, type: UserType) {
        this.username = username;
        this.type = type;
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
}

export {User, UserType}