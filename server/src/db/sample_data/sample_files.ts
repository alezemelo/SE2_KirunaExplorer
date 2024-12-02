import dayjs from "dayjs";

export const SAMPLE_FILES = [
    {
        file_url: "http://localhost:3000/static/loremipsum.txt",
        file_name: "loremipsum.txt", // Should be the same as the name in the url
        uploaded_at: dayjs.utc("2020-01-01"),
    },
    {
        file_url: "http://localhost:3000/static/map.jpg",
        file_name: "map.jpg", // Should be the same as the name in the url
        uploaded_at: dayjs.utc("2021-04-06"),
    }
];