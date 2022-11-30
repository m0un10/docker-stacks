# Firebase Realtime Database

The simplest way to use the emulated realtime database from an existing client is to set `export FIREBASE_DATABASE_EMULATOR_HOST=localhost:9000`. If you are passing a credential to `admin.initializeApp` you may also want to create a conditional to allow for it to not be passed through as it's not needed for the emulator. You still need to keep the `databaseURL` but it can be set to the real instance. The emulator will extract the name out of the URL and create a local emulated database.

More details on the Firebase Realtime Database Emulator can be found [here](https://firebase.google.com/docs/emulator-suite/connect_rtdb).