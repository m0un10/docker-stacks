# Firebase Realtime Database

## Connecting to the emulated instance

The simplest way to use the emulated realtime database from an existing client is to set `export FIREBASE_DATABASE_EMULATOR_HOST=localhost:9000`. If you are passing a credential to `admin.initializeApp` you may also want to create a conditional to allow for it to not be passed through as it's not needed for the emulator. You still need to keep the `databaseURL` but it can be set to the real instance. The emulator will extract the name out of the URL and create a local emulated database.

## Customisation and extension

If you have custom rules, they can be added to the [rules.json](rules.json).

Additional firebase services can be emulated with the same stack by simply adding them to the [firebase.json](firebase.json), for example:

```
{
  "database": {
    "rules": "rules.json"
  },
  "hosting": {
    "target": "staging",
    "public": "dist/web-ui",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "emulators": {
    "database": {
      "port": "9000",
      "host": "0.0.0.0"
    },
    "ui": {
      "port": "4000",
      "host": "0.0.0.0"
    },
    "firestore": {
      "port": "8080",
      "host": "0.0.0.0"
    },
    "auth": {
      "port": "9099",
      "host": "0.0.0.0"
    },
    "hosting": {
      "port": "50033",
      "host": "0.0.0.0"
    },
    "storage": {
      "port": "9199",
      "host": "0.0.0.0"
    }
  }
}
```

## Further reading

- [Docker Hub Docs for the Unofficial Firebase Emulator Image](https://hub.docker.com/r/spine3/firebase-emulator)
- [Official Docs for the Firebase Realtime Database Emulator](https://firebase.google.com/docs/emulator-suite/connect_rtdb).