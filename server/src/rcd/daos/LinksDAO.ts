import { pool } from "../../db/db";
import { DocumentLink, LinkType } from "../../models/document";
<<<<<<< HEAD

=======
import dayjs from "dayjs";
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98



class LinksDAO{

<<<<<<< HEAD
    async getLink(link_id: number): Promise<DocumentLink>{
=======
    /*async getLink(link_id: number): Promise<DocumentLink>{
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98
        try {
            const sql = "SELECT * FROM document_links WHERE link_id=?";
            const result = await pool.query(sql,[link_id]);
            return result.rows[0];
        } catch(error){
            throw error; 
        }
<<<<<<< HEAD
    }
=======
    }*/
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98

    async getLinks(id: number): Promise<DocumentLink[]>{
        try {
            const sql = "SELECT * FROM document_links WHERE doc_id1=$1 OR doc_id2=$1";
            const result = await pool.query(sql,[id]);
<<<<<<< HEAD
            return result.rows;
=======
            const res = result.rows.map(row => new DocumentLink(
                row.link_id,
                row.doc_id1,
                row.doc_id2,
                row.link_type,
                dayjs(row.created_at)
            ));
            return res;
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98
        } catch(error){
            throw error; 
        }
    }

    async createLink(doc_id1:number,doc_id2:number,link_type:LinkType): Promise<any>{
        try {
<<<<<<< HEAD
            const sql1 = "SELECT * FROM document_links WHERE ((doc_id1 = $1 AND doc_id2 = $2) OR (doc_id1 = $3 AND doc_id2 = $4)) AND link_type = $5";
            const result = await pool.query(sql1,[doc_id1,doc_id2,doc_id2,doc_id1,link_type]);
=======
            const sql1 = "SELECT * FROM document_links WHERE ((doc_id1 = $1 AND doc_id2 = $2) OR (doc_id1 = $2 AND doc_id2 = $1)) AND link_type = $3";
            const result = await pool.query(sql1,[doc_id1,doc_id2,link_type]);
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98
            if(result.rows.length>0){
                throw new Error("link already exists");
            }
            const sql = "INSERT INTO document_links (doc_id1,doc_id2,link_type) VALUES($1,$2,$3)";
<<<<<<< HEAD
            await pool.query(sql,[doc_id1,doc_id2,link_type]);
=======
            const res = await pool.query(sql,[doc_id1,doc_id2,link_type]);
            return res.rowCount;
>>>>>>> 1092080c56aa354756e5e26d780183b44becfd98
        } catch(error){
            throw error; 
        }
    }

}

export {LinksDAO}