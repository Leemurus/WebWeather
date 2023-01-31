#!/bin/bash

docker build -t web-weather-sql db/

if [ -z "$(docker ps -a | grep web-weather-sql-container)" ]; then
  echo "Starting new container with database"
  docker run \
    -d -p 3306:3306 \
    --name web-weather-sql-container web-weather-sql \
    --default-authentication-plugin=mysql_native_password
fi

if [ -z "$(docker ps | grep web-weather-sql-container)" ]; then
  echo "Starting existing container with database"
  docker start web-weather-sql-container
fi

exit 0