#!/bin/bash

cd sql/schema

goose postgres ${DATABASE_URL} down

goose postgres ${DATABASE_URL} up

cd ../..
