import { Document } from "../../models/document";

function groupEntriesById(res: any[]): Document[] {
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