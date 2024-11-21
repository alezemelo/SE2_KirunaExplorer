(Dragos - 14 nov @ 11:33 PM) 
# The new Coordinates Class 
I modified the `Coordinates` Class to accomodate for the whole `municipality` and the `polygon` I came up with an object that looks like the following
```js
class Coordinates {
    private type: CoordinatesType;
    private coords: CoordinatesAsPoint | CoordinatesAsPolygon | null;
}
```

## The type field
### Use it!
Using the `type` field you should be able to know how to deal with your coordinate.  
In fact, I suggest you use the `Document.toObject()` and `Document.fromJSON()` methods when using the DB, as they exploit the structure of the aforementioned class to make Documents deployable to/from the DB in a correct format.  
(most of the remaining methods are useful for testing and/or aiding the `fromJSON` and and `toObject` methods).  

### CoordinatesType.MUNICIPALITY is the default type
The default type is `MUNICIPALITY`. In fact, when creating a new document with no `Coordinates` object given, it will create a new one with `type = MUNICIPALITY` and `coords = null`. Also, the DB defaults to `MUNICIPALITY` too, so if you try to insert an object without a `coordinates_type` this will default to `MUNICIPALITY` (see `20241114203127_add_coordinates_type.ts` for the db structure update).  

## The coords field
### With Municipality
The only allowed value for `coords` when the type is municipality is `null`.  

### With Point
Point is represented by the `CoordinateAsPoint` Class:
```js
class CoordinatesAsPoint {
    private lat: number;
    private lng: number;
}
```

### With Polygon
Polygon is represented by the `CoordinatesAsPolygon` class, which uses an array of `CoordinateAsPoint` as only value:
```js
class CoordinatesAsPolygon {
    private coordinates: CoordinatesAsPoint[];
}
```

## Conversion to Geography string
e.g. ```SRID=4326;POINT(x y)``` or ```SRID=4326;POLYGON((x1 y1, x2 y2, x3 y3, x1 y1))```  
**__NOTE that the polygon is cyclic! and has a min of 4 points__**  

`toGeographyString()` returns the above formats, based on the type. It will return `undefined` in case of `MUNICIPALITY` type.  

# The API update
The routes affected by the update are: 
1) `POST /kiruna_explorer/documents` - Create new document
2) `PATCH /kiruna_explorer/documents/:id/coordinates` - Edits coordinates of a document
3) `GET /kiruna_explorer/documents/:id` - Fetch a document

The updates were, in order:  
1) `POST /kiruna_explorer/documents`   
Request Body's coordinates modified from:  
```json
{
    ...,
    "coordinates": {
      "lat": 59.3293,
      "long": 18.0686
    }
}
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to:
```json
{
    ...,
    "coordinates": {
        "type": CoordinatesType.POINT, // POINT, POLYGON, OR MUNICIPALITY
        "coords": CoordinatesAsPoint {  // null if "type" is MUNICIPALITY
            "lat": 59.3293,
            "long": 18.0686
        }
    }
}
```
2) `PATCH /kiruna_explorer/documents/:id/coordinates`  
Entire Request Body modified from:  
```json
{
  lat: 100,
  long: 200
}
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to:
```json
{
    "type": CoordinatesType.POINT, // POINT, POLYGON, OR MUNICIPALITY
    "coords": CoordinatesAsPoint {  // null if "type" is MUNICIPALITY
        "lat": 59.3293,
        "long": 18.0686
    }
}
```  

3) `GET /kiruna_explorer/documents/:id`  
Request Body's coordinates modified from:  
```json
{
    ...,
    "coordinates": {
      "lat": 59.3293,
      "long": 18.0686
    }
}
```
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to:
```json
{
    ...,
    "coordinates": {
        "type": CoordinatesType.POINT, // POINT, POLYGON, OR MUNICIPALITY
        "coords": CoordinatesAsPoint {  // null if "type" is MUNICIPALITY
            "lat": 59.3293,
            "long": 18.0686
        }
    }
}
```
