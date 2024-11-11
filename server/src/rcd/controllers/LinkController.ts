import { LinksDAO } from "../daos/LinksDAO";
import DocumentDAO from "../daos/documentDAO";
import { DocumentLink, LinkType } from "../../models/document";

class LinkController {
    private dao: LinksDAO;
    private document_dao: DocumentDAO;

    constructor() {
        this.dao = new LinksDAO();
        this.document_dao = new DocumentDAO();
    }

    async getLinks(id: number): Promise<DocumentLink[]>{
        if(await this.document_dao.getDocument(id) == null){
            throw new Error("one of the documents does not exist");
        }
        return this.dao.getLinks(id);
    }

    async createLink(doc_id1:number,doc_id2:number,link_type:LinkType): Promise<any>{
        if(doc_id1 == doc_id2){
            throw new Error("you can link only different documents")
        }
        if (await this.document_dao.getDocument(doc_id1) == null || await this.document_dao.getDocument(doc_id2) == null){
            throw new Error("one of the documents does not exist");
        }
        return await this.dao.createLink(doc_id1,doc_id2,link_type);
    }
}

export {LinkController};