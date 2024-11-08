import { Knex } from "knex";

export class Coordinates {
    lat: number;
    lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    toGeographyString(): string {
        return `SRID=4326;POINT(${this.lat} ${this.lng})`;
    }

    /* 
     * WKB stands for Well-Known Binary, in contrast to WKT (Well-Known Text)
     * The db stores the coordinates in WKB format, instead of `SRID=4326;POINT(xxxx yyyy)`, which is WKT
     */
    static isWKB(input: string): boolean {
        // Check if the input is a valid hexadecimal string
        const hexRegex = /^[0-9A-Fa-f]+$/;
        return hexRegex.test(input);
    }

    /*
     * WKT stands for Well-Known Text, in contrast to WKB (Well-Known Binary)
     * The format is like `SRID=xxxx;POINT(xxxx yyyy)`
     */
    static isWKTPoint(input: string): boolean {
        // Regular expression to validate WKT format
        const wktRegex = /^SRID=4326;POINT\(-?\d+(\.\d+)? -?\d+(\.\d+)?\)$/;
        return wktRegex.test(input);
    }

    static async wkbToWktPoint(wkb: string, db: Knex): Promise<string> {
        const result = await db.raw(`SELECT ST_AsText('${wkb}') AS wkt`);
        return `SRID=4326;${result.rows[0].wkt}`;
    }
}