## API List

For all success scenarios, always assume a `200` status code for the API response.  
For requests with wrong format, use a `422` error code.  
For unautorized requests use a `401` error code.
Specific error scenarios will have their corresponding error code.  

CORS methods to use: GET, DELETE, POST (for adding new things -- NOT idempotent), PUT (for updating things -- idempotent)

### Static API

#### GET `/kiruna_explorer/xxx`

xxx

- Request Parameters: 
- Request Body Content: 
- Response Body Content: 
- Access Constraints: 
- Additional Constraints:
  - 

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
    "stakeholders": "Stakeholder Info",
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
    "Message" : "Docuent added Successfully"
    } 
- Access Constraints:
   Only urban planner (Urban Developer)
- Additional Constraints:
  - Title and coordinates are required fields
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

#### PATCH `/kiruna_explorer/documents/:id/description`

Adds or updates a description for an existing document, the latter being sent through the body of the request.

- Request Parameters: `id`, an integer number representing the document unique ID
- Request Body Content: a string which is the description
  - Example: `This document is a compilation of the responses to the survey What is ...`
- Response Body Content: `None`
- Access Constraints: `Urban Planner` only
- Additional Constraints:
  - Returns a 404 `DocumentNotFoundError` Error if the specified id is not present in the databse
  - May return errors specified in the head of this file or any other generic error

#### GET `/kiruna_explorer/documents/search?title=mytitle`

Allows searching docs by title, the frontend should call this multiple times as the user types in the search bar. This is case insensitive.
- Request query: the string to match with the title, it is required.
  - Example: `/kiruna_explorer/documents/search?title=moving%20of%20church`
- Response Body Content: list of matching docs
  - Example: 
  ```
  [
    {
      'id': 1,
      'title': 'Compilation of responses “So what the people of Kiruna think?” (15)',
      'issuanceDate': '2007-01-01T00:00:00Z',
      'language': 'Swedish',
      'pages': ,
      'stakeholders': 'Kiruna commun/Residents',
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
      'stakeholders': 'Kiruna commun/Residents',
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
      "stakeholders": "Kiruna commun/Residents",
      "scale": "Text",
      "description": "This document is a compilation of the responses to the survey What is ...",
      "type": "Informative document",
      "lastModifiedBy": "user123",
      "coordinates": { ***valid coordinates JSON. See bottom of the file!*** }
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