import DoctypeDAO from "../daos/doctypeDAO";

class DoctypeController {
    private dao: DoctypeDAO;

    constructor() {
        this.dao = new DoctypeDAO();
    }

    public async getAllDoctypes(): Promise<string[]>{
        return await this.dao.getAllDoctypes()
    }

    async createDoctype(name: string): Promise<any>{
        return await this.dao.addDoctype(name);
    }
}

export {DoctypeController}