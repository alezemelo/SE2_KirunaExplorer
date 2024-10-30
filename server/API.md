## API List

For all success scenarios, always assume a `200` status code for the API response.  
For requests with wrong format, use a `422` error code.  
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
Edits the coordinates of a document

### xxx API

#### GET `/kiruna_explorer/yyy`

yyy

- Request Parameters:
- Request Body Content:
- Response Body Content:
  - Example: 
- Access Constraints: 
- Additional Constraints:
  - 

#### DELETE `/kiruna_explorer/yyy`

yyy

- Request Parameters:
- Request Body Content:
- Response Body Content:
  - Example: 
- Access Constraints: 
- Additional Constraints:
  - 
### Document's Link API

#### GET `/kiruna_explorer/links/:link_id`

get the link of the specified link_id

- Request Parameters: id of the link
- Request Body Content: None
- Response Body Content: An object with the following attributes:
  
- Access Constraints: None
- Additional Constraints:
  

#### GET `/kiruna_explorer/links/:doc_id`

get the links of the document specified by the doc_id

- Request Parameters: id of the document
- Request Body Content: None
- Response Body Content: 

- Access Constraints: None
- Additional Constraints:

#### POST `/kiruna_explorer/links/`

create a link between two documents

- Request Parameters: None
- Request Body Content: {

}
- Response Body Content:
- Access Constraints: Only urban planner
- Additional Constraints:
- If the user is not authenticated `403`
- If the link already exists `409`




