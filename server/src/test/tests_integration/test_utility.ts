import request from "supertest";
import { app } from "../../../index";

const RESIDENT = {username: "user1", password: "pass1"};
const URBAN_DEVELOPER = {username: "user2", password: "pass2"};
const URBAN_PLANNER = {username: "admin", password: "pass3"};

const login = async (userInfo: any) => {
    return new Promise<string>((resolve, reject) => {
        request(app).post(`/kiruna_explorer/sessions`).send(userInfo).expect(200)
            .end((err, res) => {
                if (err) {
                    reject(err)
                }
                resolve(res.header["set-cookie"][0])
            })
    })
}

export {RESIDENT, URBAN_DEVELOPER, URBAN_PLANNER, login}