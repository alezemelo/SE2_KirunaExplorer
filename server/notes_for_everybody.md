#### Use this document to add things that everybody should take into account when developing their code. If you have misgivings or doubts contact the author of the comment.  


# Dates  
(Dragos)  
Every time a field requires the date type use the `dayjs` date type instead of javascript's `Date`.  

# Db implementation

For doubts about the db structure see the file `database_structure.md` or equivalently refer to the article in the Knowledge base tab on youtrack.

# How to run the db container
Make sure you have docker installed
Navigate to the project folder and run
`docker build -t kiruna-postgis-img .`
to build an image, then to run a container from that image, run:
`docker run -d --name kiruna-postgis-container -p 5432:5432 kiruna-postgis-img`