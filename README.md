# nodejs-lambda-api

```
const { api } = require("nodejs-lambda-api");

module.exports.handle = async (event, context, callback) => {

  const app = api();
  
  app.use((req, res, next)=> {
    console.log(req)
    next()
  });
  
  app.get("/", async(req, res, next) => {

    res.json({statusCode: 200, data: "success"})

  })
  
  app.post("/", async(req, res, next) => {

    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: "posted successfully"
      })
    };
    
    res.json(response)

  })

  app.start(event, context, callback)

};
```