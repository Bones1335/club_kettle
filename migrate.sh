#!/bin/bash

cd sql/schema

goose postgres postgres://postgres:postgres@localhost:5432/club_kettle?sslmode=disable down

goose postgres postgres://postgres:postgres@localhost:5432/club_kettle?sslmode=disable up

cd ../..
