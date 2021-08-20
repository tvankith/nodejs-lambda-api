# nodejs-lambda-api

Simple api builder for serverless lambda nodejs.

### Installation

```
npm install nodejs-lambda-api
```

### Example
```
const { api } = require("nodejs-lambda-api");

const app = api();

app.use((req, res, next) => {
    next()
});

app.get("/", (req, res, next) => {
    res.status(200)
    res.json({ data: "success" })
})

app.post("/", (req, res, next) => {
    const response = {
        body: JSON.stringify({
            message: "posted successfully",
            input: req.body
        })
    };
    res.status(200)
    res.json(response)
})

app.use(function(req, res, next) {
    res.status(404)
    res.send()
});

app.use(function(err, req, res, next) {
    res.status(500)
    res.send()
});

module.exports.handle = app.handle
```
### Aws Setup
1. Set method to ANY

### Built in middlewares
1. app.use
2. app.get
3. app.post
4. app.patch
5. app.delete
6. app.update