import dayjs from "dayjs";

export const SAMPLE_DOC_LINKS = [
    {
        doc_id1: 1,
        doc_id2: 2,
        link_type: "direct",
        created_at: dayjs().format("2020-01-01 00:00:00"),
    },
    {
        doc_id1: 2,
        doc_id2: 3,
        link_type: "collateral",
        created_at: dayjs().format("2021-04-06 10:00:00"),
    },
    {
        doc_id1: 3,
        doc_id2: 4,
        link_type: "projection",
        created_at: dayjs().format("2022-12-31 23:59:59"),
    },
    {
        doc_id1: 4,
        doc_id2: 5,
        link_type: "update",
        created_at: dayjs().format("2023-01-01 00:00:00"),
    }
];