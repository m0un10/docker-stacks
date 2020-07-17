# Docker Stacks

A collection of `docker-compose` stacks to aid development. Stacks can be used in place within this repository or copied into another repository and used as a base for a specific related project.

This repository containers three flavours of stacks

* **Fungible** stacks can easily support multiple stack instances co-existing on a single machine.
* **Fixed** stacks are singletons on a given machine and contain considerable state and a bind mount to the local file system.
* **Complex** stacks are for apps which require a bit more effort than a `docker-compose up` to get started due to their inherent complexity

## Catalog

| Stack                    | Flavour  | Up Command                                 | Launch UI / Test Command     |
| -------------------------| -------- | ------------------------------------------ | ---------------------------- |
| [Confluence](confluence) | fixed    | `cd confluence && docker-compose up -d`    | `open http://localhost:8090` |
| [Jenkins](jenkins) | fungible | `cd jenkins && docker-compose up -d`       | `open http://$(docker-compose port app 8080)` |
| [Oracle SOA](oracle_soa) | complex  | [Perform prerequisites](oracle_soa/README.md) then `cd oracle_soa && docker-compose up -d`  | `open http://localhost:7001/console` |
| [OpenLDAP](openldap) | fixed | `cd openldap && docker-compose up -d` | `docker exec openldap_app_1 ldapsearch -x -H ldap://localhost -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin` |

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
