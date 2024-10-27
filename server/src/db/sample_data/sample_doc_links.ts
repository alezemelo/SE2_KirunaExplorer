import dayjs from "dayjs";

export const SAMPLE_DOC_LINKS = [
    {
        docId1: 1,
        docId2: 2,
        linkType: "direct",
        createdAt: dayjs().format("2020-01-01 00:00:00"),
    },
    {
        docId1: 2,
        docId2: 3,
        linkType: "collateral",
        createdAt: dayjs().format("2021-04-06 10:00:00"),
    },
    {
        docId1: 3,
        docId2: 4,
        linkType: "projection",
        createdAt: dayjs().format("2022-12-31 23:59:59"),
    },
    {
        docId1: 4,
        docId2: 5,
        linkType: "update",
        createdAt: dayjs().format("2023-01-01 00:00:00"),
    }
];