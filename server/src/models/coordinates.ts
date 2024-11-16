import { Knex } from "knex";

export enum CoordinatesType {
    POINT = "POINT",
    POLYGON = "POLYGON",
    MUNICIPALITY = "MUNICIPALITY",
}

export class Coordinates {
    private type: CoordinatesType;
    private coords: CoordinatesAsPoint | CoordinatesAsPolygon | null;

    /*
    * Wrapper class for CoordinatesAsPoint and CoordinatesAsPolygon. It will contain one of the two OR null (for municipality type).
    *
    * @param type Type of the coordinates
    * @param coords Coordinates object (either CoordinatesAsPoint or CoordinatesAsPolygon)
    * @returns Coordinates object
    */
    constructor(type: CoordinatesType, coords: CoordinatesAsPoint | CoordinatesAsPolygon | null) {
        if (type === CoordinatesType.POINT && !(coords instanceof CoordinatesAsPoint)) {
            throw new Error("Invalid coordinates type for POINT, expexted CoordinatesAsPoint");
        } else if (type === CoordinatesType.POLYGON && !(coords instanceof CoordinatesAsPolygon)) {
            throw new Error("Invalid coordinates type for POLYGON, expexted CoordinatesAsPolygon");
        } else if (type === CoordinatesType.MUNICIPALITY && coords !== null) {
            throw new Error("Invalid coordinates type for MUNICIPALITY, expected null");
        }

        this.type = type;
        this.coords = coords;
    }

    toGeographyString(): string | undefined {
        // Shouldn't work for municipality type
        if (this.type === CoordinatesType.MUNICIPALITY) {
            return undefined;
        } else {
        // Should work for point and polygon types (they have their own toGeographyString method)
            if (this.coords === null) {
                throw new Error("Coordinates object is null (with type Point/Polygon), unexpected.");
            } else {
                return this.coords.toGeographyString();
            }
        }
    }

    // ============== Getters and Setters ==============
    getCoords(): CoordinatesAsPoint | CoordinatesAsPolygon | null {
        return this.coords;
    }

    getType(): CoordinatesType {
        return this.type;
    }

    // ============== Static Methods ==============
    static isGeographyString(input: string): boolean {
        return CoordinatesAsPoint.isPoint(input) || CoordinatesAsPolygon.isPolygon(input);
    }
}

export class CoordinatesAsPoint {
    private lat: number;
    private lng: number;

    constructor(lat: number, lng: number) {
        this.lat = lat;
        this.lng = lng;
    }

    /* 
        * The format is like `SRID=4326;POINT(xxxx yyyy)`
        * example of point is 'SRID=4326;POINT(-71.060316 42.357777)'
    */
    toGeographyString(): string {
        return `SRID=4326;POINT(${this.lat} ${this.lng})`;
    }

    // ============== Getters and Setters ==============
    getLat(): number {
        return this.lat;
    }

    getLng(): number {
        return this.lng;
    }

    // ============== Static Methods ==============
    /* 
     * WKB stands for Well-Known Binary, in contrast to WKT (Well-Known Text)
     * The db stores the coordinates in WKB format, instead of `SRID=4326;POINT(xxxx yyyy)`, which is WKT
     */
    static isWKBPoint(input: string): boolean {
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

    static isPoint(input: string): boolean {
        return CoordinatesAsPoint.isWKBPoint(input) || CoordinatesAsPoint.isWKTPoint(input);
    }

    static async wkbToWktPoint(wkb: string, db: Knex): Promise<string> {
        const result = await db.raw(`SELECT ST_AsText('${wkb}') AS wkt`);
        return `SRID=4326;${result.rows[0].wkt}`;
    }
    
    /* 
    * Use this when extracting the coordinates from the database (should be used by Document.fromJSON method)
    */
    static async fromWKBstring(wkb: string, db: Knex): Promise<CoordinatesAsPoint> {
        const wkt = await CoordinatesAsPoint.wkbToWktPoint(wkb, db);
        // extract the fields using  /^SRID=4326;POINT\(-?\d+(\.\d+)? -?\d+(\.\d+)?\)$/;
        const regex =                /^SRID=4326;POINT\((?<lat>-?\d+(\.\d+)?) (?<lng>-?\d+(\.\d+)?)\)$/;
        const match = wkt.match(regex);

        if (match && match.groups) {
            const lat = parseFloat(match.groups.lat);
            const lng = parseFloat(match.groups.lng);
            return new CoordinatesAsPoint(lat, lng);
        } else {
            throw new Error('Invalid WKT format');
        }
    }
}

export class CoordinatesAsPolygon {
    private coordinates: CoordinatesAsPoint[];

    constructor(coordinates: CoordinatesAsPoint[]) {
        if (coordinates.length < 4) {
            throw new Error("Polygon must have at least 4 points (the first and last being the same");
        } 
        if (coordinates[0].getLat() !== coordinates[coordinates.length - 1].getLat() || coordinates[0].getLng() !== coordinates[coordinates.length - 1].getLng()) {
            throw new Error("Polygon must have the same first and last point");
        }

        this.coordinates = coordinates;
    }

    /*
        * The format is like `SRID=4326;POLYGON((x1 y1, x2 y2, x3 y3, x4 y4))`
        * exmple of polygon 'SRID=4326;POLYGON((-71.177658 42.39029, -71.16682 42.391008, -71.16362 42.373566, -71.178146 42.372085, -71.177658 42.39029))'
    */
    toGeographyString(): string {
        const points = this.coordinates.map((point) => `${point.getLat()} ${point.getLng()}`);
        return `SRID=4326;POLYGON((${points.join(",")}))`;
    }

    // ============== Getters and Setters ==============
    getCoordinates(): CoordinatesAsPoint[] {
        return this.coordinates;
    }

    // ============== Static Methods =================
    static isWKBPolygon(input: string): boolean {
        // Check if the input is a valid hexadecimal string
        const hexRegex = /^[0-9A-Fa-f]+$/;
        return hexRegex.test(input);
    }

    static isWKTPolygon(input: string): boolean {
        // Regular expression to validate WKT format
        // TODO test this other regex: /^SRID=4326;POLYGON\(\(\s*(-?\d+(\.\d+)? -?\d+(\.\d+)?(,\s*)?)+\s*\)\)$/
        const wktRegex = /^SRID=4326;POLYGON\(\(\s*(-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s*,\s*)*-?\d+(\.\d+)?\s+-?\d+(\.\d+)?\s*\)\)$/;
        return wktRegex.test(input);
    }

    static isPolygon(input: string): boolean {
        return CoordinatesAsPolygon.isWKBPolygon(input) || CoordinatesAsPolygon.isWKTPolygon(input);
    }

    static async wkbToWktPolygon(wkb: string, db: Knex): Promise<string> {
        const result = await db.raw(`SELECT ST_AsText('${wkb}') AS wkt`);
        return `SRID=4326;${result.rows[0].wkt}`;
    }

    /* 
    * Use this when extracting the coordinates from the database (should be used by Document.fromJSON method)
    */
    static async fromWKBstring(wkb: string, db: Knex): Promise<CoordinatesAsPolygon> {
        const wkt = await CoordinatesAsPolygon.wkbToWktPolygon(wkb, db);

        const regex = /^SRID=4326;POLYGON\(\((?<points>.+)\)\)$/;
        const match = wkt.match(regex);

        if (match && match.groups) {
            const points = match.groups.points.trim().split(',').map((point: string) => {
                const [lat, lng] = point.trim().split(' ').map(parseFloat);
                return new CoordinatesAsPoint(lat, lng);
            });
            return new CoordinatesAsPolygon(points);
        } else {
            throw new Error('Invalid WKT format');
        }
    }
}