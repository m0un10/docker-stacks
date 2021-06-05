# teamcity

## A note on state for this compose stack

On first boot, if the `state` directory is empty, this docker compose stack will prompt the administrator to perform 
operations such as setting up an admin account and choose a database type. For simplicity with this compose stack,
it is recommended to choose the internal database which stores the data in the `state` directory. However, this
approach should not be used for production.

## Using a version of TeamCity that is not latest

To specify a specific version of TeamCity to install, create a `.env` that looks like the following:

```
TEAMCITY_VERSION=2020.2.4
```

You don't need to set the above environment variable, unless you want a version of TeamCity that is not the `latest`.