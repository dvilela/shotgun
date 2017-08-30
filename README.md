# Shotgun

Streams data from POST to websocket. Just open it's url (example: http://localhost:3000) in the browser and see data being sent.

## Sending Data

`curl http://localhost:3000/api/v1/messages -H 'Content-Type=text/plain' -d 'Hello, World!'`

## Running

`docker run -p 3000:3000 dvilela1/shotgun`

or

```
$ git clone https://github.com/baruinho/shotgun.git
$ npm install
$ npm start
```

## Environment Variables

| Name | Default Value | Description |
| --- | :-: | --- |
| SHOTGUN_DEBUG | false | Enable debug logs. |
| SHOTGUN_PORT | 3000 | The port the app will run. |
