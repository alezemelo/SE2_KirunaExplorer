## API List

For all success scenarios, always assume a `200` status code for the API response.  
For requests with wrong format, use a `422` error code.  
For unautorized requests use a `401` error code.
Specific error scenarios will have their corresponding error code.  

CORS methods to use: GET, DELETE, POST (for adding new things -- NOT idempotent), PUT (for updating things -- idempotent)

### Index

- [Documents API](#documents-api)
  - [POST `/kiruna_explorer/documents`](#post-kiruna_explorerdocuments) - Create a new document
  - [PATCH `/kiruna_explorer/documents/:id/coordinates`](#patch-kiruna_explorerdocumentsidcoordinates) - Update coordinates
  - [POST `/kiruna_explorer/documents/:id/description`](#patch-kiruna_explorerdocumentsiddescription) - Update description
  - [GET `/kiruna_explorer/documents/search?title=mytitle`](#get-kiruna_explorerdocumentssearchtitlemytitle) - Search documents by title
  - [GET `/kiruna_explorer/documents/:id`](#get-kiruna_explorerdocumentsid) - Get document by ID
  - [POST `/kiruna_explorer/documents/:id/stakeholders`](#post-kiruna_explorerdocumentsidstakeholders) - Add stakeholders to a document
  - [DELETE `/kiruna_explorer/documents/:id/stakeholders`](#delete-kiruna_explorerdocumentsidstakeholders) - Remove stakeholders from a document
- [Link Documents API](#link-documents-api)
  - [GET `/kiruna_explorer/linkDocuments/:doc_id`](#get-kiruna_explorerlinkdocumentsdoc_id) - Get links of a document
  - [POST `/kiruna_explorer/linkDocuments/create`](#post-kiruna_explorerlinkdocumentscreate) - Create a link between documents
- [Stakeholders API](#stakeholders-api)
  - [GET `/kiruna_explorer/stakeholders`](#get-kiruna_explorerstakeholders) - Get all stakeholders
  - [POST `/kiruna_explorer/stakeholders`](#post-kiruna_explorerstakeholders) - Add a new stakeholder
- [Auth API](#auth-api)
  - [POST `/kiruna_explorer/sessions`](#post-kiruna_explorersessions) - Login
  - [DELETE `/kiruna_explorer/sessions/current`](#delete-kiruna_explorersessionscurrent) - Logout
  - [GET `/kiruna_explorer/sessions/current`](#get-kiruna_explorersessionscurrent) - Get current session
- [Files API](#files-api)
  - [POST `/files/upload`](#post-filesupload) - Upload a file
  - [GET `/files/download/:fileId`](#get-filesdownloadfileid) - Download a file
  - [GET `/files/:documentId`](#get-filesdocumentid) - Get file IDs and names associated with a document
  - [GET `/files`](#get-files) - Get all file IDs and names
- [Coordinates Format](#coordinates-format-point-polygon-municipality)


### Documents API

#### POST `/kiruna_explorer/documents`

Creates a new document

- **Request Body Content:**
  ```json
  {
    "id": 1,
    "title": "Document Title",
    "type": "Document Type",
    "lastModifiedBy": "User Name",
    "issuanceDate": "2023-10-01T00:00:00Z",
    "language": "English",
    "pages": 10,
    "stakeholders": ["Stakeholder1", "stakeholder3"],
    "scale": "1:1000",
    "description": "Document Description",
    "coordinates": { ***valid coordinates JSON. See bottom of the file!*** }
  }
- Response Status code:
  - If created: `201`
  - If error: `400`
 - Response Body Content : 
    ```json
    {
    "Message" : "Document added Successfully"
    } 
- Access Constraints:
   Only urban planner (Urban Developer)
- Additional Constraints:
  - Title and coordinates are required fields
  - Returns 400 if inserted stakeholders, type or scale are unknown
  - May return errors specified in the head of this file

#### Explanation:
1. **Request Body Content**: Specifies the JSON structure expected in the request body when creating a new document.
2. **Response Status Code**: Lists the possible HTTP status codes returned by the endpoint.
3. **Response Body Content**: Provides an example of the JSON structure returned in the response body upon successful creation.
4. **Access Constraints**: Indicates that only urban planners are allowed to access this endpoint.
5. **Additional Constraints**: Specifies that the `title` and `coordinates` fields are required and mentions that other errors may be returned as specified in the head of the file.



#### PATCH `/kiruna_explorer/documents/:id/coordinates`

Edits the coordinates of a document

- Request Parameters: `:id`, the doc id
- Request Body Content:
```json
{ ***valid coordinates JSON. See bottom of the file!*** }
```
- Response Status code:
  - If ok:  `200`
  - If document was not found: `404`
  - If other error: `500`
- Access Constraints: Only urban planner
- Additional Constraints:
  - May return errors specified in the head of this file

#### POST `/kiruna_explorer/documents/:id/description`  
*(of course this should be a PATCH but there was an error so we'll keep it like this for the time being)*

Adds or updates a description for an existing document, the latter being sent through the body of the request.

- Request Parameters: `id`, an integer number representing the document unique ID
- Request Body Content: a string which is the description
  - Example: `This document is a compilation of the responses to the survey What is ...`
- Response Body Content: `None`
- Access Constraints: `Urban Planner` only
- Additional Constraints:
  - Returns a 404 `DocumentNotFoundError` Error if the specified id is not present in the databse
  - May return errors specified in the head of this file or any other generic error


#### PATCH `/kiruna_explorer/documents/:id`

Generic patch api for a document: content of the fields will be overwritten with the sent data.
Able to overwrite stakeholders, scale, and document type.

- Request Parameters: `id`, an integer number representing the document unique ID
- Request Body Content:
  ```json
  {
    "stakeholders": ["Stakeholder1", "Stakeholder2"],
    "type": "new_type",
    "scale": "1:new_scale"
  }
  ```
- Response Body Content: `None`
- Access Constraints: `Urban Planner` only
  - Returns a 404 `DocumentNotFoundError` Error if the specified id is not present in the databse
  - May return errors specified in the head of this file or any other generic error
- Additional constraints:
  - All fields are optional, if no field is specified, nothing will be changed in the db.
  - Scale must be in the format 1:integer_positive_number, or "Text" or "blueprint/effect"

#### GET `/kiruna_explorer/documents/search?title=mytitle`

Allows searching docs by title, the frontend should call this multiple times as the user types in the search bar. This is case insensitive.
municipality_filter is an optional parameter to get only the documents related to all municipality. when it is omitted it searchs all documents. if it is present and true, it searchs the documents related to all municipality.
- Request query: the string to match with the title, it is required.
  - Example: `/kiruna_explorer/documents/search?title=moving%20of%20church`
- Response Body Content: list of matching docs
  - Example: 
  ```json
  [
    {
      'id': 1,
      'title': 'Compilation of responses “So what the people of Kiruna think?” (15)',
      'issuanceDate': '2007-01-01T00:00:00Z',
      'language': 'Swedish',
      'pages': ,
      'stakeholders': ["Kiruna commun", "Residents"],
      'scale': 'Text',
      'description': 'This document is a compilation of the responses to the survey What is ...',
      'type': 'Informative document',
      'coordinates': '',
      'lastModifiedBy': 'user123'
    },
    {
      'id': 2,
      'title': 'another doc',
      'issuanceDate': '2007-01-01T00:00:00Z',
      'language': 'Engglish',
      'pages': 20,
      'stakeholders': ["Kiruna commun", "Residents"],
      'scale': 'Text',
      'description': 'desc',
      'type': 'Informative document',
      'coordinates': '',
      'lastModifiedBy': 'user123'
    },
  ]
  ```
- Response status code:
  - `200` if successful
  - `400` if bad format of request
- Access Constraints: `Urban Planner` only



#### GET `/kiruna_explorer/documents/:id`

Fetches a `Document` object.

- **Request Parameters:** `id`, an integer number representing the document unique ID
- **Request Body Content:** `None`
- **Response Body Content:** a `Document` object
  - **Example:**
    ```json
    {
      "id": 1,
      "title": "Compilation of responses “So what the people of Kiruna think?” (15)",
      "issuanceDate": "2007-01-01T00:00:00Z",
      "language": "Swedish",
      "pages": ,
      "stakeholders": ["Kiruna commun", "Residents"],
      "scale": "Text",
      "description": "This document is a compilation of the responses to the survey What is ...",
      "type": "Informative document",
      "lastModifiedBy": "user123",
      "coordinates": { ***valid coordinates JSON. See bottom of the file!*** },
      "fileIds": [1, 2, 3]
    }
    ```
- **Access Constraints:** `None`
- **Additional Constraints:**
  - Returns a 404 `DocumentNotFoundError` Error if the specified id is not present in the database.
  - May return errors specified in the head of this file or any other generic error.

#### GET `/kiruna_explorer/linkDocuments/:doc_id`

get the links of the document specified by the doc_id

- Request Parameters: id of the document
- Request Body Content: None
- Response Body Content: 
```
[
    {
        "linkId": 505,
        "docId1": 15,
        "docId2": 18,
        "linkType": "update",
        "createdAt": "2024-11-03T23:39:18.321Z"
    }
]
```
- Access Constraints: None
- Additional Constraints:
- returns 400 if the id of the docuemnt does not exist.

#### POST `/kiruna_explorer/documents/:id/stakeholders`

adds new stakeholders to a document

- Request Parameters: id of the document
- Request Body Content: {"stakeholders", ["Residents", "White Arkitekter"]}
- Response Body Content: None
- Access contraints: Urban planner
- Additional Constraints:
  - 400 if stakeholders are already associated to doc
  - 401 if unauthorized

#### DELETE `/kiruna_explorer/documents/:id/stakeholders`

- Request Parameters: id of the document
- Request Body Content: {"stakeholders", ["Residents", "White Arkitekter"]}
- Response Body Content: {"deletedRows": 2}
- Access contraints: Urban planner
- Additional Constraints:
  - 401 if unauthorized
#### POST `/kiruna_explorer/linkDocuments/create`

create a link between two documents

- Request Parameters: None
- Request Body Content: {doc_id1: 15,
            doc_id2: 18,
            link_type: "update"}
- Response Body Content: 
- returns 1 if it is ok
- otherwise the error message
- Access Constraints: Only urban planner
- Additional Constraints:
- returns 400 if the id of the docuemnt does not exist.
- returns 422 if the request body content is not correct

### Stakeholders APIs

#### GET `kiruna_explorer/stakeholders`

gets the list of every stakeholder

- Request Parameters: None
- Request Body Content: None
- Response Content:
  ```json
  [
	{
		"name": "White Arkitekter"
	},
	{
		"name": "Kiruna kommun"
	},
	{
		"name": "Residents"
	}
  ]
  ```
- Access contraints: None

#### POST `kiruna_explorer/stakeholders`

adds a new stakeholder to the list of possible stakeholders

- Request Parameters: None
- Request Body Content:
  `{"name": "new_stakeholder"}`
- Response Content:
  - If ok:
    - Code: `201` - created
    - Body: name of new stakeholder
- Access contraints: Urban Planner
- Returns `409` if name already esists:
- returns `422` if the request body content is not correct

### Doctype APIs

These allow to get a list of every valid doctype and add a new doctype.

#### GET `kiruna_explorer/doctypes`

returns the list of all valid doctypes

- Request Parameters: None
- Request Body Content: None
- Response Content:
  - If ok:
    - Response content:
```json
[
  {"name": "prescriptive_doc"},
  {"name": "informative_doc"}
]
```
- Access constraints: None

#### POST `kiruna_explorer/doctypes`

adds a new valid doctype

- Request Parameters: None
- Request body content:
  `{"name": "new_doctype"}`
- Response Content:
  - If ok:
    - Code: `201` - created
    - Body: name of new doctype
- Access contraints: Urban Planner
- Returns `409` if name already esists:
- returns `422` if the request body content is not correct (must be a non-empty string)


### Scale APIs

These allow to get a list of every valid scale value and add a new scale value.

#### GET `kiruna_explorer/scales`

returns the list of all valid scale values 

- Request Parameters: None
- Request Body Content: None
- Response Content:
  - If ok:
    - Response content:
```json
[
  {"value": "blueprint/effect"},
  {"value": "text"},
  {"value": "1:10000"}
]
```
- Access constraints: None

#### POST `kiruna_explorer/scales`

adds a new valid scale

- Request Parameters: None
- Request body content:
  `{"value": "1:20000"}`
- Response Content:
  - If ok:
    - Code: `201` - created
    - Body: value of new scale 
- Access contraints: Urban Planner
- Returns `409` if value already esists:
- returns `422` if the request body content is not correct (must be a non-empty string and with format 1:positive_integer)

### Auth APIs

#### POST `kiruna_explorer/sessions`

Allows login for a user with the provided credentials.

- Request Parameters: None
- Request Body Content: An object having as attributes:
  - `username`: a string that must not be empty
  - `password`: a string that must not be empty
  - Example: `{username: "MarioRossi", password: "MarioRossi"}`
- Response Code:
  - `200` if successfull
  - `401` if credentials are wrong
  - `422` if formatting is wrong
- Response Body Content: A **User** object that represents the logged in user
  - Example: `{username: "Mario Rossi", type: "urban_planner"}`
- Access Constraints: None
- Additional Constraints:
  - Returns a 401 error if the username does not exist
  - Returns a 401 error if the password provided does not match the one in the database

#### DELETE `kiruna_explorer/sessions/current`

Performs logout for the current user

Performs logout for the currently logged in user.

- Request Parameters: None
- Response Code:
  - `200` if successful
  - `401` if not logged in before attempting logout
- Request Body Content: None
- Response Body Content: None
- Access Constraints: Can only be called by a logged in User

#### GET `kiruna_explorer/sessions/current`

Retrieves information about the currently logged in user.

- Request Parameters: None
- Request Body Content: None
- Response Code:
  - `200` if successful
  - `401` if not logged in before attempting call
- Response Body Content: A **User** object that represents the logged in user
  - Example: `{username: "Gianni Verdi", type: "resident"}`
- Access Constraints: Can only be called by a logged in User

### Files API

#### POST `/files/upload/:documentId/:fileName`

Uploads a file and associates it with a document.

- **Request Parameters**:
  - `documentId`: the document related to the file that was sent
  - `fileName`: The file name
- **Request Body Content**:
  - Form-data with the following fields:
    - `file`: The file to be uploaded.
- **Response Code**:
  - `201` if the file is uploaded successfully.
  - `400` if no file is uploaded.
- **Response Body Content**: the id assigned by the DB to the file, should be autoincremental
  - Example
  ```json
  {
      "fileId": 5
  }
  ```
- **Access Constraints**: Can only be called by a logged in User
  

#### GET `/files/download/:fileId`

Downloads a file by its ID.

- **Request Parameters**:
  - `fileId`: The ID of the file to be downloaded.
- **Response Code**:
  - `200` if the file is found and downloaded successfully.
  - `404` if the file is not found.
- **Response Body Content**: The file content.
- **Access Constraints**: None
- **Additional Constraints**: None


#### GET `/files/:documentId`

Retrieves all file IDs associated with a document.

- **Request Parameters**:
  - `documentId`: The ID of the document to retrieve file IDs for.
- **Response Status Code**:
  - `200` if the file IDs are retrieved successfully.
  - `404` if the document is not found.
- **Response Body Content**:
  ```json
  [
      {
          "id": 1,
          "name": "loremipsum"
      },
  ]
  ```

#### GET `/files`

Retrieves all file IDs and names.

- **Request Parameters**: None
- **Response Status Code**:
  - `200` if the file IDs and names are retrieved successfully.
  - `404` if no files are found.
- **Response Body Content**:
  ```json
  [
      {
          "id": 1,
          "name": "loremipsum"
      },
      {
          "id": 2,
          "name": "kiruna_map"
      }
  ]
  ```

# Coordinates Format (Point, Polygon, Municipality)

Point Coordinates  
```json
{
  "type": CoordinatesType.POINT,
  "coords": { 
    "lat": 59.3293,
    "lng": 18.0686
  }
}
```

Polygon Coordinates
```json
{
  "type": CoordinatesType.POLYGON, 
  "coords": {
      "coordinates": [
      { "lat": 59.3293, "lng": 18.0686 }
      { "lat": 60.3293, "lng": 4.0686  }
      { "lat": 43.3293, "lng": 44.0686 }
      { "lat": 3.3293,  "lng": 38.0686 }
    ]
  }
}
```

Municipality Coordinates
```json
{
  "type": CoordinatesType.MUNICIPALITY,
  // coords is not present (undefined) or is null
}
```