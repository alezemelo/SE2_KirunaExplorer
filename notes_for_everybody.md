#### Use this document to add things that everybody should take into account when developing their code. If you have misgivings or doubts contact the author of the comment.  


# Dates  
(Dragos)  
Every time a field requires the date type use the `dayjs` date type instead of javascript's `Date`.  
IMPORTANT: when generating a dayjs date use dayjs.utc() in order to avoid timezone bugs.  
The document dates may only have the year, but for the time being, I am handling them as year-1st-jan, so display that. Later on I'll make our own personalized DocumentDate class able to return the correct string format (i.e. only year, only year+month, or full date)

# Db implementation
(Angelo)
For doubts about the db structure see the file `database_structure.md` or equivalently refer to the article in the Knowledge base tab on youtrack.

# How to run the db container
(Angelo)
Make sure you have docker installed
Navigate to the project folder and run
`docker build -t kiruna-postgis-img .`
to build an image, then to run a container from that image, run:
`docker run -d --name kiruna-postgis-container -p 5432:5432 kiruna-postgis-img`

# I want to modify the db structure
(Angelo)
If you want to add / delete a table, or make changes to fields of a table, navigate with your command line to `server/src/db`,
then create a new migration file with
`npx knex migrate:make your_modification_name --knexfile knexfile.ts`
go to `server/src/db/src/db/migrations` and edit the migration file you just created, you can find examples on how to do it searching "knex migration" online.
When you're done, go back to `server/src/db` and run:
`npx knex migrate:latest --knexfile knexfile.ts`
if you want to roll back run:
`npx knex migrate:rollback --knexfile knexfile.ts`
New migration files should always be committed and pushed to github.
Remember to run `migrate:latest` alter a pull to get the latest version of the db, in case someone changes something. Also if you make changes to the schema please tell other people.

# Errors
(Dragos)  
Refer to the standard error codes specified at the top of API.md.  
If you feel like it's needed create an Error Object (for db errors like Foreign Constraint Error or Unique Key Error for example there's already specific objects).  