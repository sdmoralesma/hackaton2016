#!/bin/bash

mvn -o clean package && java -jar payara-micro.jar --deploy target/backend.war
