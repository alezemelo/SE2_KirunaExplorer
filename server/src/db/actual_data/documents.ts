import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
import { Document, DocumentType } from "../../models/document";
import { Coordinates, CoordinatesAsPoint, CoordinatesAsPolygon, CoordinatesType } from "../../models/coordinates";

// // Enable this when you want to test with documents also before number 15`
// // Remember that you also need to add it to the exported vector at the bottom of this file
// const doc_11 = new Document(
//   11, // ID
//   "Documetn 11 for testing", // Title
//   DocumentType.informative_doc, // Type
//   "user1", // Last modified by

//   "2005", // Issuance date
//   "Swedish", // Language
//   undefined, // Pages
//   //"Kiruna kommun/Residents", // Stakeholders
//   ["Kiruna kommun","Residents"], // Stakeholders
//   "Text", // Scale
//   `This document is a compilation of the responses to ` +
//     `the survey 'What is your impression of Kiruna?' ` +
//     `From the citizens' responses to this last part of the ` +
//     `survey, it is evident that certain buildings, such as ` +
//     `the Kiruna Church, the Hjalmar Lundbohmsgården, ` +
//     `and the Town Hall, are considered of significant ` +
//     `value to the population. The municipality views the ` +
//     `experience of this survey positively, to the extent ` +
//     `that over the years it will propose various consultation opportunities`, // Description
//     undefined // Coordinates
// );


const doc_15 = new Document(
  15, // ID
  "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
  DocumentType.informative_doc, // Type
  "user1", // Last modified by

  "2005", // Issuance date
  "Swedish", // Language
  undefined, // Pages
  //"Kiruna kommun/Residents", // Stakeholders
  ["Kiruna kommun","Residents"], // Stakeholders
  "Text", // Scale
  `This document is a compilation of the responses to ` +
    `the survey 'What is your impression of Kiruna?' ` +
    `From the citizens' responses to this last part of the ` +
    `survey, it is evident that certain buildings, such as ` +
    `the Kiruna Church, the Hjalmar Lundbohmsgården, ` +
    `and the Town Hall, are considered of significant ` +
    `value to the population. The municipality views the ` +
    `experience of this survey positively, to the extent ` +
    `that over the years it will propose various consultation opportunities`, // Description
    undefined // Coordinates
);

const doc_18 = new Document(
  18, // 1: ID
  "Detail plan for Bolagsomradet Gruvstad spark (18)", // 2: Title
  DocumentType.prescriptive_doc, // 3: Type
  "user1", // 4: Last modified by

  "2014-03-17", // 5: Issuance date
  "Swedish", // 6: Language
  32, // 7: Pages
  //"Kiruna kommun", // 8: Stakeholders
  ["Kiruna kommun"], // 8: Stakeholders
  "1:8000", // 9: Scale
  `This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the ` +
    `residential areas into mining industry zones to allow the demolition of buildings. The area includes the ` +
    `town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. ` +
    `The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a ` +
    `text explaining the reasons that led to the drafting of the plan with these characteristics. The plan ` +
    `gained legal validity in 2012.`, // 10: Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.8526128037612, 20.24253383065055)) // 11: Coordinates
)

const doc_41 = new Document(
  41, // 1: ID
  "Development Plan (41)", // 2: Title
  DocumentType.design_doc, // 3: Type
  "user1", // 4: Last modified by

  "2014-03-17", // 5: Issuance date
  "Swedish", // 6: Language
  111, // 7: Pages
  ["Kiruna kommun", "White Arkitekter"], // 8: Stakeholders
  //"Kiruna kommun/White Arkitekter", // 8: Stakeholders
  "1:7500", // 9: Scale
  `The development plan shapes the form of the new ` +
    `city. The document, unlike previous competition ` +
    `documents, is written entirely in Swedish, which ` +
    `reflects the target audience: the citizens of Kiruna. ` +
    `The plan obviously contains many elements of the ` +
    `winning masterplan from the competition, some ` +
    `recommended by the jury, and others that were ` +
    `deemed appropriate to integrate later. The document ` +
    `is divided into four parts, with the third part, ` +
    `spanning 80 pages, describing the shape the new ` +
    `city will take and the strategies to be implemented ` +
    `for its relocation through plans, sections, images, ` +
    `diagrams, and texts. The document also includes ` +
    `numerous studies aimed at demonstrating the ` +
    `future success of the project`, // 10: Description
  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.87795733042363, 20.164324773485898),
    new CoordinatesAsPoint(67.86760158832168, 20.164591698595675),
    new CoordinatesAsPoint(67.85351844008717, 20.18194183073118),
    new CoordinatesAsPoint(67.86227111154075, 20.20676586594044),
    new CoordinatesAsPoint(67.8750204078963, 20.189086203319476),
    new CoordinatesAsPoint(67.87795733042363, 20.164324773485898),

  ])) // 11: Coordinates
)
  

/*

const doc_15 = {
  id: 15, // ID
  title: "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
  type: DocumentType.informative_doc, // Type
  last_modified_by: "user1", // Last modified by
  issuance_date: "2005", // Issuance date
  language: "Swedish", // Language
  pages: undefined, // Pages
  scale: "Text", // Scale
  description: `This document is a compilation of the responses to ` +
    `the survey 'What is your impression of Kiruna?' ` +
    `From the citizens' responses to this last part of the ` +
    `survey, it is evident that certain buildings, such as ` +
    `the Kiruna Church, the Hjalmar Lundbohmsgården, ` +
    `and the Town Hall, are considered of significant ` +
    `value to the population. The municipality views the ` +
    `experience of this survey positively, to the extent ` +
    `that over the years it will propose various consultation opportunities`, // Description
  coordinates: undefined // Coordinates
}

const doc_18 = {
  id: 18, // 1: ID
  title: "Detail plan for Bolagsomradet Gruvstad spark (18)", // 2: Title
  type: DocumentType.prescriptive_doc, // 3: Type
  last_modified_by: "user1", // 4: Last modified by
  issuance_date: "2014-03-17", // 5: Issuance date
  language: "Swedish", // 6: Language
  pages: 32, // 7: Pages
  scale: "1:8.000", // 9: Scale
  description: `This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the ` +
    `residential areas into mining industry zones to allow the demolition of buildings. The area includes the ` +
    `town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. ` +
    `The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a ` +
    `text explaining the reasons that led to the drafting of the plan with these characteristics. The plan ` +
    `gained legal validity in 2012.`, // 10: Description
  coordinates: new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.8526128037612, 20.24253383065055)) // 11: Coordinates
}

const doc_41 = {
  id: 41, // 1: ID
  title: "Development Plan (41)", // 2: Title
  type: DocumentType.design_doc, // 3: Type
  last_modified_by: "user1", // 4: Last modified by
  issuance_date: "2014-03-17", // 5: Issuance date
  language: "Swedish", // 6: Language
  pages: 111, // 7: Pages
  scale: "1:7.500", // 9: Scale
  description: `The development plan shapes the form of the new ` +
    `city. The document, unlike previous competition ` +
    `documents, is written entirely in Swedish, which ` +
    `reflects the target audience: the citizens of Kiruna. ` +
    `The plan obviously contains many elements of the ` +
    `winning masterplan from the competition, some ` +
    `recommended by the jury, and others that were ` +
    `deemed appropriate to integrate later. The document ` +
    `is divided into four parts, with the third part, ` +
    `spanning 80 pages, describing the shape the new ` +
    `city will take and the strategies to be implemented ` +
    `for its relocation through plans, sections, images, ` +
    `diagrams, and texts. The document also includes ` +
    `numerous studies aimed at demonstrating the ` +
    `future success of the project`, // 10: Description
  coordinates: new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.87795733042363, 20.164324773485898),
    new CoordinatesAsPoint(67.86760158832168, 20.164591698595675),
    new CoordinatesAsPoint(67.85351844008717, 20.18194183073118),
    new CoordinatesAsPoint(67.86227111154075, 20.20676586594044),
    new CoordinatesAsPoint(67.8750204078963, 20.189086203319476),
    new CoordinatesAsPoint(67.87795733042363, 20.164324773485898),

  ])) // 11: Coordinates
}
*/

const doc_45 = new Document(
  45, 
  "Deformation forecast (45)",
  DocumentType.technical_doc,
  "user1",
  "2014-12-17",
  "swedish",
  1,
  ["LKAB"],
  "1:12000",
  `This document is a development plan that shapes the form of the` +
`new city of Kiruna. The document is written entirely in Swedish,` +
`targeting the citizens of Kiruna. The development plan integrates `+
`many elements of the winning masterplan from the competition,` +
`some recommended by the jury and others deemed appropriate to add later.` +
`The document is divided into four parts, with the third part` +
`consisting of 80 pages. This section describes the shape the` +
`new city will take and the strategies to be implemented for its` +
`relocation. It includes plans, sections, images, diagrams, and` +
`texts. Additionally, the document incorporates numerous studies` +
`aimed at demonstrating the future success of the project.`,

  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.835724, 20.237934),
    new CoordinatesAsPoint(67.835788, 20.224887),
    new CoordinatesAsPoint(67.851067, 20.215103),
    new CoordinatesAsPoint(67.860368, 20.218170),
    new CoordinatesAsPoint(67.853833, 20.240657),
    new CoordinatesAsPoint(67.835724, 20.237934),
  ]))
);

const doc_50 = new Document(
  50,
  "Detail plan for square and commercial street (50)",
  DocumentType.prescriptive_doc,
  "user1",
  "2016-06-22",
  "Swedish",
  43,
  ["Kiruna kommun"],
  "1:1000",
  `This plan, approved in July 2016, is the first detailed plan to be implemented from the` +
  `new masterplan (Adjusted development plan). The document defines the entire area near` +
  `the town hall, comprising a total of 9 blocks known for their density. Among these are` +
  `the 6 buildings that will face the main square. The functions are mixed, both public` +
  `and private, with residential being prominent, as well as the possibility of incorporating` +
  `accommodation facilities such as hotels. For all buildings in this plan, the only height` +
  `limit is imposed by air traffic.`,
 
  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.848442, 20.277820

    ),
    new CoordinatesAsPoint(67.849228, 20.297395),
    new CoordinatesAsPoint(67.850736, 20.278475),
    new CoordinatesAsPoint(67.854793, 20.274170),
    new CoordinatesAsPoint(67.858639, 20.278943),
    new CoordinatesAsPoint(67.851547, 20.312264),
    new CoordinatesAsPoint(67.848195, 20.316289),
    new CoordinatesAsPoint(67.847665, 20.315915),
    new CoordinatesAsPoint(67.848442, 20.277820),
  ]))
);
const doc_47 = new Document(
  47,
  "Adjusted development plan (47)",
  DocumentType.design_doc,
  "user1",
  "2015-00-00",
  "Swedish",
  1,
  ["Kiruna kommun", "White Arkitekter"],
  "1:7500",
  `This document is the update of the Development Plan, one year after its creation. `+
  `Modifications are made to the general master plan, which is published under the name` +
  `'Adjusted Development Plan91,' and still represents the version used today after 10 years. `+
  `Certainly, there are no drastic differences compared to the previous plan, but upon careful` +
  `comparison, several modified elements stand out. For example, the central square now takes` +
  `its final shape, as well as the large school complex just north of it, which appears for the` +
  `first time. `,
  
  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.853500, 20.323000),  // Top-left
    new CoordinatesAsPoint(67.856800, 20.306000),  // Top-right
    new CoordinatesAsPoint(67.859700, 20.285000),  // Bottom-right
    new CoordinatesAsPoint(67.857100, 20.271000),  // Middle-right
    new CoordinatesAsPoint(67.853000, 20.277000),  // Bottom-center
    new CoordinatesAsPoint(67.849500, 20.290000),  // Bottom-left
    new CoordinatesAsPoint(67.850500, 20.317000),  // Center-left
    new CoordinatesAsPoint(67.853500, 20.323000),  // Closing the loop
    
  ]))
);

const doc_63 = new Document(
  63, // 1: ID
  "Construction of Scandic Hotel begins (63)", // 2: Title
  DocumentType.material_effect, // 3: Type
  "user1", // 4: Last modified by
  "2019-04-01", // 5: Issuance date
  "-", // 6: Language
  undefined, // 7: Pages
  ["LKAB"], // 8: Stakeholders
  "blueprints/effects", // 9: Scale
  `After two extensions of the land acquisition agreement, necessary because this document in Sweden ` +
    `is valid for only two years, construction of the hotel finally began in 2019.`, // 10: Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.848528, 20.304778)) // 11: Coordinates
);
const doc_64 = new Document(
  64, // 1: ID
  "Town Hall demolition (64)", // 2: Title
  DocumentType.material_effect, // 3: Type
  "user1", // 4: Last modified by

  "2019-04-01", // 5: Issuance date
  "-", // 6: Language
  undefined, // 7: Pages
  ["LKAB"], // 8: Stakeholders
  "blueprints/effects", // 9: Scale
  `After the construction of the new town hall was completed, the old building, nicknamed "The Igloo," ` +
    `was demolished. The only elements preserved were the door handles, a masterpiece of Sami art made ` +
    `of wood and bone, and the clock tower, which once stood on the roof of the old town hall. The clock ` +
    `tower was relocated to the central square of New Kiruna, in front of the new building.`, // 10: Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.852500, 20.222444)) // 11: Coordinates
);
const doc_65 = new Document(
  65, // 1: ID
  "Construction of Aurora Center begins (65)", // 2: Title
  DocumentType.material_effect, // 3: Type
  "user1", // 4: Last modified by

  "2019-05-01", // 5: Issuance date
  "-", // 6: Language
  undefined, // 7: Pages
  ["LKAB"], // 8: Stakeholders
  "blueprints/effects", // 9: Scale
  `Shortly after the construction of the Scandic hotel began, work on the Aurora Center also started, ` +
    `a multifunctional complex that includes the municipal library of Kiruna. The two buildings are ` +
    `close to each other and connected by a skywalk, just like in the old town center.`, // 10: Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.849167, 20.304389)) // 11: Coordinates
);
const doc_69 = new Document(
  69, // 1: ID
  "Construction of Block 1 begins (69)", // 2: Title
  DocumentType.material_effect, // 3: Type
  "user1", // 4: Last modified by

  "2019-06-01", // 5: Issuance date
  "-", // 6: Language
  undefined, // 7: Pages
  ["LKAB"], // 8: Stakeholders
  "blueprints/effects", // 9: Scale
  `Simultaneously with the start of construction on the Aurora Center, work also began on Block 1, ` +
    `another mixed-use building overlooking the main square and the road leading to old Kiruna. ` +
    `These are the first residential buildings in the new town.`, // 10: Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.848567, 20.300333)) // 11: Coordinates
);

const ds1 = {
  doc_id: 15,
  stakeholder_id: "Kiruna kommun",
}

const ds2 = {
  doc_id: 15,
  stakeholder_id: "Residents",
} 

const ds3 = {
  doc_id: 18,
  stakeholder_id: "Kiruna kommun",
}

const ds4 = {
  doc_id: 41,
  stakeholder_id: "Kiruna kommun",
}

const ds5 = {
  doc_id: 41,
  stakeholder_id: "White Arkitekter",
}

const ds6 = {
  doc_id: 45,
  stakeholder_id: "LKAB",
}

const ds7 = {
  doc_id: 50,
  stakeholder_id: "Kiruna kommun",
}

const ds8 = {
  doc_id: 47,
  stakeholder_id: "Kiruna kommun",
}

const ds9 = {
  doc_id: 47,
  stakeholder_id: "White Arkitekter",
}

const ds10 = {
  doc_id: 63,
  stakeholder_id: "LKAB",
}

const ds11 = {
  doc_id: 64,
  stakeholder_id: "LKAB",
}

const ds12 = {
  doc_id: 65,
  stakeholder_id: "LKAB",
}

const ds13 = {
  doc_id: 69,
  stakeholder_id: "LKAB",
}


const actualDocuments = [doc_15, doc_18, doc_41,doc_45, doc_50,doc_47,doc_63,doc_64,doc_65,doc_69]
//const actualDocuments = [doc11, doc_15, doc_18, doc_41,doc_45, doc_50,doc_47,doc_63,doc_64,doc_65,doc_69]
const docs_stakeholders = [ds1,ds2,ds3,ds4,ds5,ds6,ds7,ds8,ds9,ds10,ds11,ds12,ds13]

export { actualDocuments, docs_stakeholders }