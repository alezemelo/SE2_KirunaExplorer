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
  //new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.8526128037612, 20.24253383065055)) // 11: Coordinates
    new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.84328093631012, 20.22910414264149),
    new CoordinatesAsPoint(67.84004850710195, 20.227879817331058),
    new CoordinatesAsPoint(67.83974063334625, 20.21839129617254),
    new CoordinatesAsPoint(67.84220350966217, 20.217881160626405),
    new CoordinatesAsPoint(67.84243439098952, 20.220635892575245),
    new CoordinatesAsPoint(67.84393506393013, 20.21818724195279),
    new CoordinatesAsPoint(67.8496290472581, 20.21798318773466),
    new CoordinatesAsPoint(67.85305246268504, 20.212167642508945),
    new CoordinatesAsPoint(67.8564369187201, 20.21073926297882),
    new CoordinatesAsPoint(67.85697530961721, 20.212269669617285),
    new CoordinatesAsPoint(67.8553985583101, 20.217677106406683),
    new CoordinatesAsPoint(67.85351400834318, 20.22288048897795),
    new CoordinatesAsPoint(67.85359093173145, 20.223798732961967),
    new CoordinatesAsPoint(67.85305246268504, 20.224308868508075),
    new CoordinatesAsPoint(67.85289861210245, 20.22349265163396),
    new CoordinatesAsPoint(67.85120618870124, 20.223696705852092),
    new CoordinatesAsPoint(67.84720542694834, 20.228798061313512),
    new CoordinatesAsPoint(67.84720542694834, 20.230634549279955),
    new CoordinatesAsPoint(67.84643597101254, 20.231348739045842),
    new CoordinatesAsPoint(67.84578191351133, 20.23012441373379),
    new CoordinatesAsPoint(67.84431983631634, 20.230838603499677),
    new CoordinatesAsPoint(67.84328093631012, 20.22910414264149)
  ])) 
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
      new CoordinatesAsPoint(67.85468232660816, 20.273379599956996),
      new CoordinatesAsPoint(67.85677766588856, 20.273132541590826),
      new CoordinatesAsPoint(67.85649829819701, 20.279432529921166),
      new CoordinatesAsPoint(67.85328532914397, 20.282026642763697),
      new CoordinatesAsPoint(67.85305248809641, 20.285114872337573),
      new CoordinatesAsPoint(67.85556704838271, 20.286473693350104),
      new CoordinatesAsPoint(67.85533423011773, 20.289932510472795),
      new CoordinatesAsPoint(67.84988561903253, 20.301050136939352),
      new CoordinatesAsPoint(67.85053765664074, 20.304261895696783),
      new CoordinatesAsPoint(67.8535647353321, 20.29895014082922),
      new CoordinatesAsPoint(67.85505484513098, 20.300679549390537),
      new CoordinatesAsPoint(67.84816228903168, 20.317479518273444),
      new CoordinatesAsPoint(67.8476499231258, 20.316120697260942),
      new CoordinatesAsPoint(67.84844175660055, 20.305620716709313),
      new CoordinatesAsPoint(67.84830202323454, 20.297961907365448),
      new CoordinatesAsPoint(67.84476183207457, 20.27683841707966),
      new CoordinatesAsPoint(67.84527426141702, 20.273997245870987),
      new CoordinatesAsPoint(67.84820886719234, 20.28635016416746),
      new CoordinatesAsPoint(67.85081709574996, 20.286720751716274),
      new CoordinatesAsPoint(67.85044450952714, 20.278567825641005),
      new CoordinatesAsPoint(67.85468232660816, 20.273379599956996)
  ]))
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
  "Swedish",
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

const doc_102 = new Document(
  102, // 1: ID
  "Kiruna Church closes (102)", // 2: Title
  DocumentType.material_effect, // 3: Type
  "user1", // 4: Last modified by

  "2024-06-02", // 5: Issuance date
  "-", // 6: Language
  undefined, // 7: Pages
  ["LKAB"], // 8: Stakeholders
  "blueprints/effects", // 9: Scale
  `On June 2, the Kiruna Church was closed to begin the necessary preparations for its relocation, ` +
    `following a solemn ceremony. The relocation is scheduled for the summer of 2025 and will take two` +
    `days. Both the new site and the route for the move have already been determined. A significant period` +
    `will pass between the relocation and the reopening of the church, voted "Sweden's most beautiful` +
    `building constructed before 1950."`, // 10: Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.8519511599584, 20.233138061669795)) // 11: Coordinates
);

const doc_42 = new Document(
  42, // 1: ID
  "Detailed plan for LINBANAN 1. (42)", // 2: Title
  DocumentType.prescriptive_doc, // 3: Type
  "user1", // 4: Last modified by

  "2024-03", // 5: Issuance date
  "Swedish", // 6: Language
  15, // 7: Pages
  ["Kiruna kommun"], // 8: Stakeholders
  "1:500", // 9: Scale
  `This is the first Detailed Plan for the new city center, covering a very small area. It regulates the use of a, ` +
    `portion of land that will host a single building. Its boundaries coincide with the outer footprint of the` +
    `new Town Hall, "Kristallen," the first building to be constructed in the new Kiruna.`, // 10: Description
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.84898662346073, 20.302749006735986)) // 11: Coordinates
);

const doc_4 = new Document(
  4, // 1: ID
  "Vision 2099 (4)", // 2: Title
  DocumentType.design_doc, // 3: Type
  "user1", // 4: Last modified by

  "2004", // 5: Issuance date
  "Swedish", // 6: Language
  2, // 7: Pages
  ["Kiruna kommun"], // 8: Stakeholders
  "Text", // 9: Scale
  `Vision 2099 is to be considered the first project for the new city of Kiruna. It was created by the municipality ` +
    `in response to the letter from LKAB. In these few lines, all the main aspects and expectations of ` +
    `the municipality for the new city are condensed. The document, which despite being a project document `+
    `is presented anonymously, had the strength to influence the design process. The principles it ` +
    `contains proved to be fundamental in subsequent planning documents.` , // 10: Description
    undefined // 11: Coordinates
);

const doc_58 = new Document(
  58,
  "Detailed plan for Gruvstaspark 2, etapp 3, del av SJ-området m m. (58)",
  DocumentType.prescriptive_doc,
  "user1",
  "2018-10",
  "Swedish",
  46,
  ["Kiruna kommun"],
  "1:1500",
  `The third Detailed Plan of the second demolition phase covers a narrow, elongated area straddling `+
  `the old railway. Like all areas within the "Gruvstadpark 2" zone, its sole designated land use is for ` +
  `mining activities, although it will temporarily be used as a park during an interim phase. `,
  
  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.85991359273675, 20.206185351872165),  // Top-left
    new CoordinatesAsPoint(67.86059888803035, 20.204449604945268),  // Top-right
    new CoordinatesAsPoint(67.86143990472112, 20.20482155071619),  // Bottom-right
    new CoordinatesAsPoint(67.8618915493098, 20.207466498412145),  // Middle-right
    new CoordinatesAsPoint(67.86059888803035, 20.209078263416018),  // Bottom-center
    new CoordinatesAsPoint(67.86081693230818, 20.21052471918796),  // Bottom-left
    new CoordinatesAsPoint(67.85986686732397, 20.211640556497628),  // Center-left
    new CoordinatesAsPoint(67.86008491844879, 20.212880375730464),  // Closing the loop
    new CoordinatesAsPoint(67.85866754967995, 20.214574795348682),  // Closing the loop
    new CoordinatesAsPoint(67.85865197372019, 20.21610390573653),  // Closing the loop
    new CoordinatesAsPoint(67.85731240225812, 20.22098052805353),  // Closing the loop
    new CoordinatesAsPoint(67.85615968613553, 20.22160043767076),  // Closing the loop
    new CoordinatesAsPoint(67.85581697575765, 20.21879018074128),  // Closing the loop
    new CoordinatesAsPoint(67.85648681406997, 20.21763301612438),  // Closing the loop
    new CoordinatesAsPoint(67.856253151728, 20.215607978044034),  // Closing the loop
    new CoordinatesAsPoint(67.85798219761011, 20.212012502267072),  // Closing the loop
    new CoordinatesAsPoint(67.85768624389715, 20.209946136879466),  // Closing the loop
    new CoordinatesAsPoint(67.85866754967995, 20.20783844418321),  // Closing the loop
    new CoordinatesAsPoint(67.85989801760951, 20.20783844418321),  // Closing the loop
    new CoordinatesAsPoint(67.85991359273675, 20.206185351872165),  // Closing the loop
    
  ]))
);

const doc_49 = new Document(
  49,
  "Detail plan for square and commercial street (49)",
  DocumentType.prescriptive_doc,
  "user1",
  "2016-06-22",
  "Swedish",
  43,
  ["Kiruna kommun"],
  "1:1000",
  `This plan, approved in July 2016, is the first detailed plan to be implemented from the new masterplan `+
  `(Adjusted development plan). The document defines the entire area near the town hall, comprising ` +
  `a total of 9 blocks known for their density. Among these are the 6 buildings that will face the `+
  `main square. The functions are mixed, both public and private, with residential being prominent, as ` +
  `well as the possibility of incorporating accommodation facilities such as hotels. For all buildings in this ` +
  `plan, the only height limit is imposed by air traffic.`,
  
  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.84848059471247, 20.297430391863372),  // Top-left
    new CoordinatesAsPoint(67.8496675186748, 20.297576807755206),  // Top-right
    new CoordinatesAsPoint(67.84980552916937, 20.300651541468227),  // Bottom-right
    new CoordinatesAsPoint(67.85008154770827, 20.30057833352228),  // Middle-right
    new CoordinatesAsPoint(67.85097858540081, 20.305153830120332),  // Bottom-center
    new CoordinatesAsPoint(67.84950190500388, 20.307642900268803),  // Bottom-left
    new CoordinatesAsPoint(67.84998494159126, 20.311120277682306),  // Center-left
    new CoordinatesAsPoint(67.84820455722777, 20.310607822063673),  // Closing the loop
    new CoordinatesAsPoint(67.84848059471247, 20.297430391863372),  // Closing the loop

    
  ]))
);

const doc_48 = new Document(
  48,
  "Construction of new city hall begins (48)",
  DocumentType.material_effect,
  "user1",
  "2015",
  "-", // 6: Language
  undefined, // 7: Pages
  ["LKAB"],
  "blueprints/effects",
  `The Kiruna Town Hall was the first building to be rebuild in the new town center in 2015. It remained `+
  `isolated for quite some time due to a slowdown in mining activities.`,
  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.84891875325867, 20.30288318460373)) // 11: Coordinates
);

const doc_81 = new Document(
  81,
  "Gruvstadspark 2, etapp 5, Kyrkan (81)",
  DocumentType.prescriptive_doc,
  "user1",
  "2021-09-04",
  "Swedish", // 6: Language
  56, // 7: Pages
  ["Kiruna kommun"],
  "1:2000",
  `The last detailed plan of the second planning phase concerns the area surrounding the Kiruna Church. `+
  `Situated within a park, the area includes only six buildings, half of which serve religious functions.`+
  `The plan also specifies that the church will be dismantled between 2025 and 2026 and reassembled at its new site by 2029. `,

  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.85133800337334, 20.229942404870997),  // Top-left
    new CoordinatesAsPoint(67.85243703165469, 20.229879031442266),  // Top-right
    new CoordinatesAsPoint(67.85277150824277, 20.231146500010993),  // Bottom-right
    new CoordinatesAsPoint(67.85269983509207, 20.23304770286353),  // Middle-right
    new CoordinatesAsPoint(67.85291485388348, 20.233111076292232),  // Bottom-center
    new CoordinatesAsPoint(67.85289096300465, 20.234695412002253),  // Bottom-left
    new CoordinatesAsPoint(67.85358378855665, 20.237230349139736),  // Center-left
    new CoordinatesAsPoint(67.85210255026914, 20.23894143170719),  // Closing the loop
    new CoordinatesAsPoint(67.84985662243699, 20.234822158859743),  // Closing the loop
    new CoordinatesAsPoint(67.85071679056503, 20.23399830428974),  // Closing the loop
    new CoordinatesAsPoint(67.85133800337334, 20.229942404870997),  // Top-left

  ]))
);

const doc_2 = new Document(
  2, // 1: ID
  "Mail to Kiruna kommun (2)", // 2: Title
  DocumentType.prescriptive_doc, // 3: Type
  "user1", // 4: Last modified by

  "2004-03-19", // 5: Issuance date
  "Swedish", // 6: Language
  1, // 7: Pages
  ["LKAB"], // 8: Stakeholders
  "Text", // 9: Scale
  `This document is considered the act that initiates the process of relocating Kiruna. The company communicates ` +
    `its intention to construct a new mining level at a depth of 1,365 meters. Along with this, ` +
    `LKAB urges the municipality to begin the necessary planning to relocate the city, referring to a series of `+
    `meetings held in previous months between the two stakeholders. ` , // 10: Description
    undefined // 11: Coordinates
);

const doc_62 = new Document(
  62,
  "Deformation forecast (62)",
  DocumentType.technical_doc,
  "user1",
  "2019-04",
  "Swedish",
  1,
  ["LKAB"],
  "1:12000",
  `The third deformation forecast was published in 2019, five years after the second. The line has not `+
  `moved; what changes, as in the previous version, are the timing of the interventions and the shape ` +
  `of the areas underlying the deformation zone. `, // 10: Description
  
  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.86481748171062, 20.21157934104096),  // Point 1
    new CoordinatesAsPoint(67.86294133526926, 20.213877363026285),  // Point 2
    new CoordinatesAsPoint(67.85774506458873, 20.229069841705126),  // Point 3
    new CoordinatesAsPoint(67.85336582618746, 20.236985250764462),  // Point 4
    new CoordinatesAsPoint(67.85172941615906, 20.239027936973628),  // Point 5
    new CoordinatesAsPoint(67.84850438970608, 20.242091966287376),  // Point 6
    new CoordinatesAsPoint(67.847782307763, 20.235325568220134),  // Point 7
    new CoordinatesAsPoint(67.84619364880334, 20.23672991498833),  // Point 8
    new CoordinatesAsPoint(67.84585664663007, 20.233793553563288),  // Point 9
    new CoordinatesAsPoint(67.84229375444724, 20.239410940637242),  // Point 10
    new CoordinatesAsPoint(67.84128256430657, 20.238006593869073),  // Point 11
    new CoordinatesAsPoint(67.83881073303482, 20.239452092194767),  // Point 12
    new CoordinatesAsPoint(67.84221366512125, 20.21878774420327),  // Point 13
    new CoordinatesAsPoint(67.84592936582999, 20.22458570224515),  // Point 14
    new CoordinatesAsPoint(67.84651428765551, 20.218726075896654),  // Point 15
    new CoordinatesAsPoint(67.84840960073646, 20.219736808312717),  // Point 16
    new CoordinatesAsPoint(67.84830692808515, 20.2221644040078),  // Point 17
    new CoordinatesAsPoint(67.84987859915779, 20.222855428274528),  // Point 18
    new CoordinatesAsPoint(67.85218347437348, 20.21616674697546),  // Point 19
    new CoordinatesAsPoint(67.85438310202014, 20.2179385685767),  // Point 20
    new CoordinatesAsPoint(67.85785128329064, 20.21360741805529),  // Point 21
    new CoordinatesAsPoint(67.85837138834154, 20.20728165626184),  // Point 22
    new CoordinatesAsPoint(67.8604165855302, 20.200739402257426),  // Point 23
    new CoordinatesAsPoint(67.86344088317497, 20.1949355821819),  // Point 24
    new CoordinatesAsPoint(67.86495003453044, 20.21102753303188),  // Point 25
    new CoordinatesAsPoint(67.86481748171062, 20.21157934104096)  // Point 1

  ]))
);

const doc_76 = new Document(
  76,
  "Demolition documentation, Kiruna City Hall (76)",
  DocumentType.informative_doc,
  "user1",
  "2020-11-26",
  "Swedish", // 6: Language
  162, // 7: Pages
  ["Norrbotten Museum"],
  "Text",
  `This document was created to preserve the memory of the symbolic building before its demolition `+
  `in April 2019. Conducted by the Norrbotten Museum, the detailed 162-page study analyzed the `+
  `building's materials, both physically and chemically, taking advantage of the demolition to explore `+
  `aspects that couldn't be examined while it was in use. This meticulous effort reflects a commitment `+
  `to preserving knowledge of every detail of the structure. `,


  new Coordinates(CoordinatesType.POINT, new CoordinatesAsPoint(67.849167, 20.304389)) // 11: Coordinates
);

const doc_44 = new Document(
  44,
  "Detailed Overview Plan for the Central Area of Kiruna 2014. (44)",
  DocumentType.prescriptive_doc,
  "user1",
  "2014-06",
  "Swedish",
  136,
  ["Kiruna kommun"],
  "1:30000",
  `The Detailed Overview Plan is one of the three planning instruments available to Swedish administrations `+
  `and represents an intermediate scale. Like the Overview Plan, compliance with it is not mandatory, ` +
  `but it serves as a supporting plan for Detailed Plans, sharing the characteristic of regulating a specific `+ 
  `area of the Kiruna municipality rather than its entire extent, as the Overview Plan does. This specific plan `+
  `focuses on the central area of Kiruna and its surroundings, incorporating all the projections of `+ 
  `the Development Plan into a prescriptive tool. `,  // 10: Description


  new Coordinates(CoordinatesType.POLYGON, new CoordinatesAsPolygon([
    new CoordinatesAsPoint(67.88245271245663, 20.14372851615488),  // Point 1
    new CoordinatesAsPoint(67.86487414338634, 20.33658882105169),  // Point 2
    new CoordinatesAsPoint(67.85543311600742, 20.389779830408656),  // Point 3
    new CoordinatesAsPoint(67.82346045024462, 20.384975481177435),  // Point 4
    new CoordinatesAsPoint(67.81905592372652, 20.374680447107067),  // Point 5
    new CoordinatesAsPoint(67.81646463776843, 20.388407159199318),  // Point 6
    new CoordinatesAsPoint(67.7847445746593, 20.32808933123883),  // Point 7
    new CoordinatesAsPoint(67.78777499738956, 20.317783188208296),  // Point 8
    new CoordinatesAsPoint(67.78978077021958, 20.295968140782065),  // Point 9
    new CoordinatesAsPoint(67.78781399355941, 20.250791545031944),  // Point 10
    new CoordinatesAsPoint(67.80079336171673, 20.168089117837667),  // Point 11
    new CoordinatesAsPoint(67.81301093468244, 20.155634789836768),  // Point 12
    new CoordinatesAsPoint(67.83600418628083, 20.140697870573575),  // Point 13
    new CoordinatesAsPoint(67.86280336134885, 20.151844123885155),  // Point 14
    new CoordinatesAsPoint(67.87277064145493, 20.160949199693533),  // Point 15
    new CoordinatesAsPoint(67.88245271245663, 20.14372851615488),  // Point 1


  ]))
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

const ds14 = {
  doc_id: 102,
  stakeholder_id: "LKAB",
}

const ds15 = {
  doc_id: 42,
  stakeholder_id: "Kiruna kommun",
}

const ds16 = {
  doc_id: 4,
  stakeholder_id: "Kiruna kommun",
}

const ds17 = {
  doc_id: 58,
  stakeholder_id: "Kiruna kommun",
}

const ds18 = {
  doc_id: 49,
  stakeholder_id: "Kiruna kommun",
}

const ds19 = {
  doc_id: 48,
  stakeholder_id: "LKAB",
}

const ds20 = {
  doc_id: 81,
  stakeholder_id: "Kiruna kommun",
}

const ds21 = {
  doc_id: 2,
  stakeholder_id: "LKAB",
}

const ds22 = {
  doc_id: 62,
  stakeholder_id: "LKAB",
}

const ds23 = {
  doc_id: 76,
  stakeholder_id: "Norrbotten Museum",
}

const ds24 = {
  doc_id: 44,
  stakeholder_id: "Kiruna kommun",
}

const actualDocuments = [doc_15, doc_18, doc_41,doc_45, doc_50,doc_47,doc_63,doc_64,doc_65,doc_69, doc_102, doc_42, doc_4, doc_58, doc_49, doc_48, doc_81, doc_2, doc_62, doc_76, doc_44]
//const actualDocuments = [doc11, doc_15, doc_18, doc_41,doc_45, doc_50,doc_47,doc_63,doc_64,doc_65,doc_69]
const docs_stakeholders = [ds1,ds2,ds3,ds4,ds5,ds6,ds7,ds8,ds9,ds10,ds11,ds12,ds13,ds14, ds15, ds16, ds17, ds18, ds19, ds20, ds21, ds22, ds23,ds24]

export { actualDocuments, docs_stakeholders }
