# nodejs-lambda-api

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

### Functions
1. res.status
2. res.json
3. next
4. app.use
6. app.get
7. app.post
8. app.patch
9. app.delete
10. app.update