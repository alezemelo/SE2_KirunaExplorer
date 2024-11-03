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
    "coordinates": {
      "lat": 59.3293,
      "long": 18.0686
    }
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

### Explanation:
1. **Request Body Content**: Specifies the JSON structure expected in the request body when creating a new document.
2. **Response Status Code**: Lists the possible HTTP status codes returned by the endpoint.
3. **Response Body Content**: Provides an example of the JSON structure returned in the response body upon successful creation.
4. **Access Constraints**: Indicates that only urban planners are allowed to access this endpoint.
5. **Additional Constraints**: Specifies that the `title` and `coordinates` fields are required and mentions that other errors may be returned as specified in the head of the file.



#### PATCH `/kiruna_explorer/documents/:id/coordinates`

Edits the coordinates of a document

- Request Parameters: `:id`, the doc id
- Request Body Content:
```
{
  lat: 100,
  long: 200
}
```
- Response Status code:
  - If ok:  `200`
  - If error: `500`
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

#### GET `/kiruna_explorer/documents/:id`

Fetches a `Document` object.

- **Request Parameters:** `id`, an integer number representing the document unique ID
- **Request Body Content:** `None`
- **Response Body Content:** a `Document` object
  - **Example:**
    ```
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
