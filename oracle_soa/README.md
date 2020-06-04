# Docker stack for Oracle FMW

## Downloading the Docker images

Before you can run this Docker stack, you must download the official Oracle Database and WebLogic images from Oracle.
In order to be able to do this, you first need to [sign up for an Oracle account](https://profile.oracle.com/myprofile/account/create-account.jspx).

Once you have done this:

1. Type `docker login container-registry.oracle.com` and enter your Oracle account credentials
2. Ensure the Oracle Standard Terms and Restrictions are accepted at https://container-registry.oracle.com.
3. Pull the images you need. For example:

```
docker pull container-registry.oracle.com/middleware/soasuite:12.2.1.3-200418
docker pull container-registry.oracle.com/database/enterprise:12.2.0.1
```

## Starting the stack

```
docker-compose up -d
```

## Adding more domains

If you want to add another unique domain reusing the same database (for resource efficiency), follow the steps below:

1. Copy and paste the whole `domain` section of the `docker-compose.yml`
2. Update the name from `domain` to something unique like `<env>_domain`
3. Change the port mappings so they don't conflict with the other domain (e.g. use `8001 and 8002` instead)
4. Update the `RCUPREFIX` value to be different to the one used by the other domain.
5. Optionally, you may wish to change the `DOMAIN_NAME` to be unique but that's not strictly necessary. Every other variable can remain the same. Below is an example of a second domain, if you're feeling lazy just copy and paste that as it already has the changes as described in the previous 5 steps

```
test_domain:
  image: container-registry.oracle.com/middleware/soasuite:12.2.1.3-200418
  ports:
    - 8001:7001
    - 8002:7002
  environment:
    - CONNECTION_STRING=db:1521/soapdb.us.oracle.com
    - RCUPREFIX=SOA2
    - DB_PASSWORD=Oradoc_db1
    - DB_SCHEMA_PASSWORD=Welcome1
    - ADMIN_PASSWORD=Welcome1
    - DOMAIN_NAME=test_soainfra
    - DOMAIN_TYPE=soa
    - ADMIN_HOST=localhost
  healthcheck:
    test: "curl --silent --fail localhost:7001/console || exit 1"
  depends_on:
    db:
      condition: service_healthy
  volumes:
    - ./state:/u01/oracle/user_projects
```

## Troubleshooting

### Unable to download the images

If the image pull is failing with `Error: image not found.` this could be because you haven't done `docker login container-registry.oracle.com` and accepted the terms and restrictions. This has to be done manually after logging into https://container-registry.oracle.com with an Oracle Account.

### Database is failing to start

Make sure you have enough memory assigned to your docker engine. By default Docker doesn't typically use all of the system's memory and the Oracle database can be a bit of a memory hog.

### WebLogic domain is failing to boot due to a database issue

Try starting the database before the domain

```
docker-compose up -d db
docker-compose up -d domain
```
