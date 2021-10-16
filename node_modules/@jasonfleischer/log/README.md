## [@jasonfleischer/log](https://www.npmjs.com/package/@jasonfleischer/log)

A simple and lightweight log package. Click [HERE](https://jasonfleischer.github.io/npm-log-demo/) to see a demo

![Screenshot](https://jasonfleischer.github.io/npm-log-demo/screenshot/screen.png "Screenshot")

#### Installation
```bash
$ npm i @jasonfleischer/log
```

#### Usage
``` javascript
const log = require("@jasonfleischer/log")

log.i("normal log message");

log.e("error log message");

log.turnOffNonErrorLogs();
```

