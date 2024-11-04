import { LinksDAO } from "../daos/LinksDAO";
<<<<<<< HEAD
=======
import DocumentDAO from "../daos/documentDAO";
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98
import { DocumentLink, LinkType } from "../../models/document";

class LinkController {
    private dao: LinksDAO;
<<<<<<< HEAD

    constructor() {
        this.dao = new LinksDAO();
    }

    async getLinks(id: number): Promise<DocumentLink[]>{
=======
    private document_dao: DocumentDAO;

    constructor() {
        this.dao = new LinksDAO();
        this.document_dao = new DocumentDAO();
    }

    async getLinks(id: number): Promise<DocumentLink[]>{
        if(await this.document_dao.getDocument(id) == null){
            throw new Error("one of the documents does not exist");
        }
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98
        return this.dao.getLinks(id);
    }

    async createLink(doc_id1:number,doc_id2:number,link_type:LinkType): Promise<any>{
<<<<<<< HEAD
        return this.dao.createLink(doc_id1,doc_id2,link_type);
=======
        if (await this.document_dao.getDocument(doc_id1) == null || await this.document_dao.getDocument(doc_id2) == null){
            throw new Error("one of the documents does not exist");
        }
        return await this.dao.createLink(doc_id1,doc_id2,link_type);
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98
    }
}

export {LinkController};