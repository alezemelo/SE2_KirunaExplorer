import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

import { Document, DocumentType } from "../../models/document";

const doc_15 = new Document(
  15, // ID
  "Compilation of responses “So what the people of Kiruna think?” (15)", // Title
  DocumentType.informative_doc, // Type
  "admin", // Last modified by

  dayjs.utc("2005"), // Issuance date
  "Swedish", // Language
  undefined, // Pages
  "Kiruna kommun/Residents", // Stakeholders
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
  "admin", // 4: Last modified by

  dayjs.utc("2014-03-17"), // 5: Issuance date
  "Swedish", // 6: Language
  32, // 7: Pages
  "Kiruna kommun", // 8: Stakeholders
  "1:8.000", // 9: Scale
  `This is the first of 8 detailed plans located in the old center of Kiruna, aimed at transforming the ` +
    `residential areas into mining industry zones to allow the demolition of buildings. The area includes the ` +
    `town hall, the Ullspiran district, and the A10 highway, and it will be the first to be dismantled. ` +
    `The plan consists, like all detailed plans, of two documents: the area map that regulates it, and a ` +
    `text explaining the reasons that led to the drafting of the plan with these characteristics. The plan ` +
    `gained legal validity in 2012.`, // 10: Description
  undefined // 11: Coordinates
)

const doc_41 = new Document(
  41, // 1: ID
  "Development Plan (41)", // 2: Title
  DocumentType.design_doc, // 3: Type
  "admin", // 4: Last modified by

  dayjs.utc("2014-03-17"), // 5: Issuance date
  "Swedish", // 6: Language
  111, // 7: Pages
  "Kiruna kommun/White Arkitekter", // 8: Stakeholders
  "1:7.500", // 9: Scale
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
  undefined // 11: Coordinates
)

const documents = [doc_15, doc_18, doc_41]

export default documents