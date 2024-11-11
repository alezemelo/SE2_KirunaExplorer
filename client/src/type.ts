export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  export interface DocumentType {
    id: number;
    title: string;
    stakeholders: string;
    scale: string;
    issuance_date: any;
    type: string;
    connection: string[];
    language: string;
    pages: number;
    description: string;
    coordinates?: Coordinates;
  }
  