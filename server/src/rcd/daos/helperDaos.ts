import { Knex } from "knex";
import { Document } from "../../models/document";

async function groupEntriesById(res: any[], db: Knex): Promise<Document[]> {
    res = await Promise.all(res.map(row => Document.fromJSON(row, db)));
    return res.reduce((acc, row) => {
        let document = acc.find((doc: { id: any; }) => doc.id === row.id);
        if (!document) {
            document = { ...row, stakeholders: [] };
            acc.push(document);
        }
        if (row.stakeholders) {
            document.stakeholders.push(row.stakeholders);
        }
        return acc;
    }, []);
}

export { groupEntriesById };