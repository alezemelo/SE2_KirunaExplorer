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

