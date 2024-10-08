# Docker Stacks

A collection of `docker-compose` stacks to aid development. Stacks can be used in place within this repository or copied into another repository and used as a base for a specific related project.

This repository containers three flavours of stacks

* **Fungible** stacks can easily support multiple stack instances co-existing on a single machine.
* **Fixed** stacks are singletons on a given machine and contain considerable state and a bind mount to the local file system.
* **Complex** stacks are for apps which require a bit more effort than a `docker-compose up` to get started due to their inherent complexity. For these stacks it's best to consult their individual README file before trying to use them.

## Catalog

| Stack                    | Flavour  | Up Command                                 | Launch UI / Test Command     |
| -------------------------| -------- | ------------------------------------------ | ---------------------------- |
| [Apache Airflow](airflow) | complex  | [Perform prerequisites](https://airflow.apache.org/docs/apache-airflow/stable/start/docker.html) then `cd airflow && docker-compose up -d`. On the first run it may take a while to boot up. | `open http://localhost:8080` |
| [Appsmith](appsmith) | fixed | `cd appsmith && docker-compose up -d` | `open http://localhost:80` |
| [Confluence](confluence) | fixed    | `cd confluence && docker-compose up -d`    | `open http://localhost:8090` |
| [Docker Registry](docker_registry) | fixed | `cd docker_registry && docker-compose up -d`    | `open http://localhost:5000/v2/_catalog` |
| [etcd + etcd-browser](etcd) | fungible | `cd etcd && docker-compose up -d`  | `open http://$(docker-compose port browser 8000) && ETCDCTL_API=2 etcdctl ls / --endpoints http://$(docker-compose port api 2379),http://$(docker-compose port api 2380)` |
| [gRPC client/server w/ node](grpc) | fixed | `cd grpc && docker-compose up server -d` | `docker-compose up client` |
| [Firebase Realtime Database](firebase_rtdb) | fixed | `cd firebase_rtdb && docker-compose up -d` | `open http://$(docker-compose port db 4000)` |
| [Hapi FHIR Server](hapi_fhir) | fungible | `cd hapi_fhir && docker-compose up -d` | `open http://$(docker-compose port app 8080)` |
| [Jenkins](jenkins) | fungible | `cd jenkins && docker-compose up -d` | `open http://$(docker-compose port app 8080)` |
| [Kafka](kafka) | fixed | `cd kafka && docker-compose up -d` | `open http://localhost:9021` |
| [MailHog](mailhog) | fixed | `cd mailhog && docker-compose up -d` | `curl "smtp://localhost:1025" --mail-from 'from@foo.com' --mail-rcpt 'to@bar.com' -T <(echo -e 'Subject: Hello\n\nWorld!') && open http://$(docker-compose port app 8025)` |
| [Microsoft SQL Service](mssql) | fixed | `cd mssql && docker-compose up -d` | `docker exec -it mssql_db_1 /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "Pass@word"` |
| [nginx](nginx) | fungible | `cd nginx && docker-compose up -d` | `open http://$(docker-compose port proxy 80)` |
| [Neo4j](neo4j) | fixed | `cd neo4j && docker-compose up -d` | `curl http://localhost:7474` |
| [OpenLDAP](openldap) | fixed | `cd openldap && docker-compose up -d` | `docker exec openldap_app_1 ldapsearch -x -H ldap://localhost -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin` |
| [Oracle SOA](oracle_soa) | complex  | [Perform prerequisites](oracle_soa/README.md) then `cd oracle_soa && docker-compose up -d` | `open http://localhost:7001/console` |
| [Postgres](postgres) | fixed | `cd postgres && docker-compose up -d` | `open http://localhost:8080` |
| [Portainer](portainer) | fungible | `cd portainer && docker-compose up -d` | `open http://$(docker-compose port app 9000)` |
| [Rundeck](rundeck) | fixed | `cd rundeck && docker-compose up -d` |  `open http://localhost:4440` |
| [Structurizr](structurizr) | fungible | `cd structurizr && docker-compose up -d` |  `open http://$(docker-compose port app 8080)` |
| [TeamCity](teamcity) | fixed | `cd teamcity && docker-compose up -d` |  `open http://localhost:8111` |
| [Wordpress](wordpress) | fixed | `cd wordpress && docker-compose up -d` | `open http://localhost:8000` |

Note: The above `open` command assumes the default browser supports `0.0.0.0` as an alternative to `localhost`. If it doesn't, we'll need to extract the port separately. For example, `open http://localhost:$(docker-compose port db 4000 | cut -d: -f2)`

## Fungible stacks

Fungible stacks are easy to recreate or run as multiple separate instances.

Fungible stacks do **not** have fixed port mappings to allow for multiple stacks to exist on a single machine when needed.

Fungible stacks can be started with the `-p <prefix>` flag. This can be useful when needing to have a stable instance and a more experimental one.

For example:

```
docker-compose -p stable up
docker-compose -p experimental up
```

The prefix of the stack is reflected in
the names of the stacks (e.g. `stable_app_1` and `experimental_app_1`).

To determine the assigned port for a given stack, run the following:

```
docker-compose port <service> <container-port>
```

Fungible stacks with volumes will be stateful even after `docker-compose rm` is ran unless the `-v` flag is set. That means that running `docker-compose rm -fv` will wipe all state and `docker-compose rm` will not.

## Fixed stacks

Fixed stacks are not designed to be fungible. They have ports that are mapped to fixed numbers (rather than being auto-assigned like with a fungible stack). They also typically contain a volume or a bind mount which stores the state on the local file system in a `state` directory. The only way to wipe the state for fixed stacks is to remove the directory (or delete the volume in a case where there is no bind mount). The `.gitignore` file ensures that the state does not get committed to this repository for any stack. The state should be backed up elsewhere outside this repository.

## Complex stacks

Unfortunately some applications just aren't built for containers. But why not try?

Stacks which are categorised as complex generally have one or more of the following traits:

1. They have images that need to be built first or require login to a private repository of a third party vendor
2. They require a specific startup order at boot-time
3. They are not always tolerant to containers being rebooted or destroyed

The constraints are due to the applications themselves and not docker. To see which constraints apply to complex stack check their `README.md` file.

## Using the stacks in this repository

All stacks assume that `docker` and `docker-compose` is installed and running natively.

## Naming conventions

Stacks should follow standard service naming conventions to make it easy to work with them
in a predictable way.

| name | type       | purpose                             |
| ---- | ---------- | ----------------------------------- |
| ui   | component  | the web user interface container    |
| api  | component  | the api container                   |
| db   | component  | the database container              |
| app  | all-in-one | multiple services in one            |
