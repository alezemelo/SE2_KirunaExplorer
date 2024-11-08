REM Build the Docker image
docker build -t kiruna-postgis-img .

REM Run the Docker container
docker run -d --name kiruna-postgis-container -p 5432:5432 kiruna-postgis-img