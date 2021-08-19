# nodejs-lambda-api

### Installation

```
npm install nodejs-lambda-api
```

### Example
```
const { api } = require("nodejs-lambda-api");

const app = api();

module.exports.handle = async (event, context, callback) => {

    app.use((req, res, next) => {
        next()
    });

    app.get("/", async (req, res, next) => {
        res.json({ statusCode: 200, data: "success" })
    })

    app.post("/", async (req, res, next) => {
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: "posted successfully",
                input: req.body
            })
        };
        res.json(response)
    })
    app.start(event, context, callback)

};
```
### Aws Setup
1. Set method to ANY