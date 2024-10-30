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

