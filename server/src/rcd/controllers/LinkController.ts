import { LinksDAO } from "../daos/LinksDAO";
import { DocumentLink } from "../../models/document";

class LinkController {
    private dao: LinksDAO;

    constructor() {
        this.dao = new LinksDAO();
    }

    async getLinks(id: number): Promise<DocumentLink[]>{
        return this.dao.getLinks(id);
    }

    async createLink(link:DocumentLink): Promise<any>{
        this.dao.createLink(link);
    }
}