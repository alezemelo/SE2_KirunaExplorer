import { pool } from "../../db/db";
import { LinkType } from "../../models/document";




class LinksDAO{

    async getLinks(id: number): Promise<LinkType[]>{
        try {
            const sql = "SELECT * FROM document_links WHERE doc_id1=? OR doc_id2=?";
            const result = await pool.query(sql,[id]);
            return result.rows;
        } catch(error){
            throw error; 
        }
    }

    async createLink(link:LinkType): Promise<any>{
        try {
            const sql = "INSERT INTO document_links (doc_id1,doc_id2,link_type,created_at) VALUES($1,$2,$3,$4)";
            await pool.query(sql,[link]);
        } catch(error){
            throw error; 
        }
    }
    

}