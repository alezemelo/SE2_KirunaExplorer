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

    async createLink(link:DocumentLink): Promise<any>{
        try {
            const sql1 = "SELECT * FROM document_links WHERE (doc_id1=$1 AND doc_id2=$2) OR (doc_id1=$3 AND doc_id2=$4) AND link_type=$5";;
            const result = await pool.query(sql1,[link.docId1,link.docId2,link.docId2,link.docId1,link.linkType]);
            if(result.rows.length>0){
                throw new Error("link already exists");
            }
            const sql = "INSERT INTO document_links (doc_id1,doc_id2,link_type,created_at) VALUES($1,$2,$3,$4)";
            await pool.query(sql,[link]);
        } catch(error){
            throw error; 
        }
    }

}

export {LinksDAO}