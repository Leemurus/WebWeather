#!/bin/bash

docker build -t web-weather-sql .
[ ! "$(docker ps -a | grep web-weather-sql-container)" ] && docker run -d -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password --default-authentication-plugin=mysql_native_password --name web-weather-sql-container web-weather-sql

exit 0