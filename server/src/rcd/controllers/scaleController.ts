import ScaleDAO from "../daos/scaleDAO";

class ScaleController{
    private dao: ScaleDAO;

    constructor() {
        this.dao = new ScaleDAO();
    }

    public async getAllScales(): Promise<string[]>{
        return await this.dao.getAllScales()
    }

    async createScale(name: string): Promise<any>{
        return await this.dao.addScale(name);
    }
}

export {ScaleController};