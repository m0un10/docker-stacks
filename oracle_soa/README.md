# Docker stack for Oracle SOA

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

## Anatomy of the Docker Compose stack

The [docker-compose.yml](docker-compose.yml) consists of an Oracle database and a WebLogic domain running on two separate containers. The Oracle database is installed and configured on first boot so could take some time to start up for the first time. This is also the case for the WebLogic domain. Once the database is up and available, it will run the WebLogic domain configuration steps to create a domain and seed database users required. For subsequent starts, it will see that the database users and domain exist (as per the persistent data in the volumes) and continue to the start steps without doing any unneeded configuration on-boot.

The configuration parameters are provided as environment variables.

| Variable | Container | Description |
| -------- | --------- | ----------- |
| `DB_SID` | `db` | The database sid to be used / created on first boot |
| `DB_PDB` | `db` | The pluggable database to be used / created on first boot |
| `DB_BUNDLE` | `db` | This can be left as `basic` for most use-cases |
| `DB_DOMAIN` | `db` | The database domain which will be used for connectivity from the WebLogic instance |
| `CONNECTION_STRING` | `domain` | The connect string for the database. i.e. `db:1521/<DB_PDB>.<DB_DOMAIN>`` |
| `RCUPREFIX` | `domain` | The prefix to be used for all of the schemas when the repository creation utility (RCU) is run on the first boot |
| `DB_PASSWORD` | `domain` | The system database password. The default is `Oradoc_db1` |
| `DB_SCHEMA_PASSWORD` | `domain` | The password to be used for the schemas |
| `ADMIN_PASSWORD` | `domain` | The name of the domain to be used / created on first boot |
| `DOMAIN_NAME` | `domain` | The name of the domain to be used / created on first boot |
| `DOMAIN_TYPE` | `domain` | The type of domain to create - `soa` or `osb` |

**WARNING:** Some instructions indicate that the `ADMIN_HOST` should be set but this is not recommended due to the way WebLogic stores the real IP addresses rather than the hostname for binding when this is set. If you decide to set `ADMIN_HOST` (e.g. `ADMIN_HOST=localhost`) then it is not advisable to destroy containers or make changes that would result in a change to the container IP. In this case, you may not be able to start your container anymore and the only way to fix this is to delete the `state` directory so that it recreates the domain again to honour the new IP address. The setting on the `ADMIN_HOST` is generally only relevant for non-containerised workloads.

The following persistent files/folders will be created on the first boot in the data volume.

| Host path | Container guest path | Description |
| --------- | -------------------- | ----------- |
| `state/domains/<DOMAIN_NAME>` | /u01/oracle/user_projects/domains/<DOMAIN_NAME> | The WebLogic domain home where all configuration resides |
| `state/container/<DOMAIN_NAME>` | | State directory for indicating if RCU and the domain configuration have completed (to prevent it running again when it is unneeded) |

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
5. Change the `DOMAIN_NAME` to be unique for the stack (or alternatively, make sure the `/u01/oracle/user_projects` path is not shared to prevent a domain name clash)

Every other variable can remain the same.

Below is an example of a second domain, if you're feeling lazy just copy and paste that as it already has the changes as described in the previous 5 steps

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

Make sure you have enough memory assigned to your docker engine. By default Docker doesn't typically use all of the system's memory and the Oracle database can be a bit of a memory hog. You can also check the health of the database by running the following:

```
docker inspect --format "{{json .State.Health }}"  oracle_soa_db_1
```

### WebLogic domain is failing to boot

If you suspect this is due to a database access issue, try starting the database before the domain

```
docker-compose up -d db
docker-compose up -d domain
```

To see the health of the WebLogic admin server run this:

```
docker inspect --format "{{json .State.Health }}"  oracle_soa_domain_1
```
