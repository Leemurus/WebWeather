#!/bin/bash

docker build -t web-weather-sql db/

if [ ! "$(docker ps -a | grep web-weather-sql-container)" ]; then
  docker run \
    -d -p 3306:3306 \
    --name web-weather-sql-container web-weather-sql \
    --default-authentication-plugin=mysql_native_password
fi

if [ ! "$(docker ps | grep web-weather-sql-container)" ]; then
  docker start web-weather-sql-container
fi

exit 0