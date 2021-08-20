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
                "path": event.path
            }
            obj.res = {
                "json": (body) => {
                    context.done(null, {
                        statusCode: obj.status || 200,
                        body: JSON.stringify(body)
                    })
                },
            }
            obj.res.status = (status) => {
                obj["status"] = status
            }
            obj.res.send = (status) => {
                context.done(null, {
                    statusCode: obj.status || 200,
                })
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
