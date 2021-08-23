const { setMethodMiddlewares } = require("./methods");

const api = () => {
    let middlewares = {};
    let obj = {
        req: {},
        middleWareCount: -1,
        res: {
            "status": (status) => {
                obj.status = status
            }
        },
        mw: [],
        use: (mwFunction) => {
            if (typeof mwFunction === "function") {
                ++obj.middleWareCount
                const key = String(obj.middleWareCount)
                middlewares[key] = {}
                middlewares[key]["function"] = mwFunction
                middlewares[key]["order"] = String(obj.middleWareCount)
                middlewares[key]["description"] = "anonymous"
                if(mwFunction.length === 4) {
                    middlewares[key]["errorHandler"] = true
                }
            }
        },
        handle: (event, context, callback) => {
            obj.nextCounter = -1
            obj.mw = Object.keys(middlewares)
            obj.status = 200
            obj.req = {
                "body": event.body,
                "method": event.httpMethod,
                "path": event.path,
                "query": event.queryStringParameters
            }
            obj.res = {
                "json": (body) => {
                    const response = {
                        statusCode: obj.status || 200,
                        body: JSON.stringify(body),
                        multiValueHeaders: obj.res.headers
                    }
                    context.done(null, response)
                },
                "headers": {}
            }
            obj.res.status = (status) => {
                obj["status"] = status
            }
            obj.res.send = (status) => {
                context.done(null, {
                    statusCode: obj.status || 200,
                    multiValueHeaders: obj.res.headers
                })
            }
            obj.res.setHeaders = (key, value) => {
                obj.res.headers[key] = typeof value === "string" ? [value] : value
            }
            obj.next(obj.nextCounter)
        },
        next: async () => {
            ++obj.nextCounter
            try {
                if (middlewares[obj.nextCounter].function) {
                    await middlewares[obj.nextCounter].function(obj.req, obj.res, obj.next)
                } else {
                    return
                }
                
            } catch(err){
                ++obj.nextCounter
                while(middlewares[obj.nextCounter] && middlewares[obj.nextCounter].function && !middlewares[obj.nextCounter]["errorHandler"]) {
                    ++obj.nextCounter
                }
                if(middlewares[obj.nextCounter] && middlewares[obj.nextCounter].function) {
                    middlewares[obj.nextCounter].function(err, obj.req, obj.res, obj.next)
                }
            }
            
        },
        middlewares
    };
    setMethodMiddlewares(obj)
    return obj
};
exports.api = api;
