# yoga: YARN logs as a service

## Motivation

Easy way to retrive yarn applications logs.

## Implementaion

A simple python script that act as a HTTP proxy of ``yarn logs`` command.

## Usage

Run the Flask server: ``python server.py`` then call the API "/APP_ID"
