import { pool } from "../../db/db";
import { DocumentLink, LinkType } from "../../models/document";




class LinksDAO{

    async getLink(link_id: number): Promise<DocumentLink>{
        try {
            const sql = "SELECT * FROM document_links WHERE link_id=?";
            const result = await pool.query(sql,[link_id]);
            return result.rows[0];
        } catch(error){
            throw error; 
        }
    }

    async getLinks(id: number): Promise<DocumentLink[]>{
        try {
            const sql = "SELECT * FROM document_links WHERE doc_id1=$1 OR doc_id2=$1";
            const result = await pool.query(sql,[id]);
            return result.rows;
        } catch(error){
            throw error; 
        }
    }

    async createLink(doc_id1:number,doc_id2:number,link_type:LinkType): Promise<any>{
        try {
            const sql1 = "SELECT * FROM document_links WHERE ((doc_id1 = $1 AND doc_id2 = $2) OR (doc_id1 = $3 AND doc_id2 = $4)) AND link_type = $5";
            const result = await pool.query(sql1,[doc_id1,doc_id2,doc_id2,doc_id1,link_type]);
            if(result.rows.length>0){
                throw new Error("link already exists");
            }
            const sql = "INSERT INTO document_links (doc_id1,doc_id2,link_type) VALUES($1,$2,$3)";
            await pool.query(sql,[doc_id1,doc_id2,link_type]);
        } catch(error){
            throw error; 
        }
    }

}

export {LinksDAO}