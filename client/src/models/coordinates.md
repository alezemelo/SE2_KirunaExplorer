# Coordinates
The coordinate object contains two fields, a `type` and the actual `coords` 

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

# How To Access Fields

Using `getCoords()` and `getType()` one can access the coordinates and the type. `getCoords()` will return one of 3 possible types of values, which are `CoordinatesAsPoint`, `CoordinatesAsPolygon`, or null.  
Now, the obtained CoordinatesAs... can access their internal fields through another set of getters.
