# docker-registry

The ultimate goal of this stack is to support pull from a local cache for 

- cases where large docker images need to be kept so they don't need to be re-download. This is a useful additional cache for cases where a `docker system prune` has wiped big images that are still needed.
- edge cases where a pull has to be done without internet access

Currently, it needs a bit more work as the goal is to adopt the approach described [here](https://jig.tools/2017/11/01/working-locally-with-docker-while-on-the-road/).