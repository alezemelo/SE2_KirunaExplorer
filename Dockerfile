# gets the official PostGIS image
FROM postgis/postgis:17-3.5

# set environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=kiruna07
ENV POSTGRES_DB=kirunadb

# expose port 5432
EXPOSE 5432

# remove this comment to add sql script to initalize db with tables, currently does not do anything though
# COPY ./init.sql /docker-entrypoint-initdb.d/init.sql