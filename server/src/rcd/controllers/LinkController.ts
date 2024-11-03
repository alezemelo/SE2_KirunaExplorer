import { LinksDAO } from "../daos/LinksDAO";
import { DocumentLink, LinkType } from "../../models/document";

class LinkController {
    private dao: LinksDAO;

    constructor() {
        this.dao = new LinksDAO();
    }

    async getLinks(id: number): Promise<DocumentLink[]>{
        return this.dao.getLinks(id);
    }

    async createLink(doc_id1:number,doc_id2:number,link_type:LinkType): Promise<any>{
        return this.dao.createLink(doc_id1,doc_id2,link_type);
    }
}

export {LinkController};