# Docker Stacks

A collection of `docker-compose` stacks to aid development. Stacks can be used in place within this repository or copied into another repository and used as a base for a specific related project.

This repository containers two flavours of stacks

* **Flexible** stacks can be ran in a stateless or stateful mode and can support multiple stack instances co-existing on a single machine.
* **Fixed** stacks are singletons on a given machine and contain considerable state and a bind mount to the local file system.

## Catalog

| Stack                    | Flavour |
| ------------------------ | ------- |
| [Confluence](confluence) | fixed   |

## Flexible stacks

Flexible stacks are *fungible*, meaning it is easy to recreate them or run multiple separate instances.

Flexible stacks do **not** have fixed port mappings to allow for multiple stacks to exist on a single machine when needed.

Flexible stacks can be started with the `-p <prefix>` flag. This can be useful when needing to have a stable instance and a more experimental one.

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

Flexible stacks with volumes will be stateful even after `docker-compose rm` is ran unless the `-v` flag is set. That means that running `docker-compose rm -fv` will wipe all state and `docker-compose rm` will not.

## Fixed stacks

Fixed stacks are not designed to be fungible. They contain a bind mount which stores the state on the local file system in a `state` directory. The only way to wipe the state for fixed stacks is to remove that directory. The `.gitignore` file ensures that the state does not get committed to this repository for any stack. The state should be backed up elsewhere outside this repository.

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
