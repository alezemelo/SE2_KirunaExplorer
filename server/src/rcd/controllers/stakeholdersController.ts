import StakeholdersDAO from "../daos/stakeholdersDAO";
import DocumentDAO from "../daos/documentDAO";

class StakeholdersController {
    private dao: StakeholdersDAO;

    constructor() {
        this.dao = new StakeholdersDAO();
    }

    public async getAllStakeholders(): Promise<string[]>{
        return await this.dao.getAllStakeholders()
    }

    async createStakeholder(name: string): Promise<any>{
        return await this.dao.addStakeholder(name);
    }
}

export {StakeholdersController};