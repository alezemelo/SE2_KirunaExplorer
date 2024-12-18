import pgdb from "../../db/temp_db";
import { DocumentLink, LinkType } from "../../models/document";
import dayjs from "dayjs";



class LinksDAO{

    /*async getLink(link_id: number): Promise<DocumentLink>{
        try {
            const sql = "SELECT * FROM document_links WHERE link_id=?";
            const result = await pgdb.client.query(sql,[link_id]);
            return result.rows[0];
        } catch(error){
            throw error; 
        }
    }*/

    /**
     * 
     * Allows to get every link in the database
     * @returns a promise that resolves to an array of every link in the database
     */
    async getAllLinks(): Promise<DocumentLink[]> {
        try {
            const sql = "SELECT * FROM document_links";
            const result = await pgdb.client.query(sql);
            const res = result.rows.map(row => new DocumentLink(
                row.link_id,
                row.doc_id1,
                row.doc_id2,
                row.link_type,
                dayjs(row.created_at)
            ));
            return res;
        } catch (error) {
            throw error;
        }
    }

    async getLinks(id: number): Promise<DocumentLink[]>{
        try {
            const sql = "SELECT * FROM document_links WHERE doc_id1=$1 OR doc_id2=$1";
            const result = await pgdb.client.query(sql,[id]);
            const res = result.rows.map(row => new DocumentLink(
                row.link_id,
                row.doc_id1,
                row.doc_id2,
                row.link_type,
                dayjs(row.created_at)
            ));
            return res;
        } catch(error){
            throw error; 
        }
    }

    async createLink(doc_id1:number,doc_id2:number,link_type:LinkType): Promise<any>{
        try {
            const sql1 = "SELECT * FROM document_links WHERE ((doc_id1 = $1 AND doc_id2 = $2) OR (doc_id1 = $2 AND doc_id2 = $1)) AND link_type = $3";
            const result = await pgdb.client.query(sql1,[doc_id1,doc_id2,link_type]);
            if(result.rows.length>0){
                throw new Error("link already exists");
            }
            const sql = "INSERT INTO document_links (doc_id1,doc_id2,link_type) VALUES($1,$2,$3)";
            const res = await pgdb.client.query(sql,[doc_id1,doc_id2,link_type]);
            return res.rowCount;
        } catch(error){
            throw error; 
        }
    }

}

export {LinksDAO}