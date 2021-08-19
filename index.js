const { methods } = require("./methods");
const { uuidv4 } = require("./uuid");

const api = () => {
    let app = {};
    let obj = {
        "nextCounter": -1,
        req: {},
        res: {},
        mw: [],
        use: (mw)=> {
            if(typeof mw === "object") {
                obj = {...mw, ...obj}
            } else if(typeof mw === "function") {
                app[uuidv4] = mw
            }
        },
        start: async (event, context, callback) => {
            obj.mw = Object.keys(app)
            obj.req = {
                "body": event.body,
                "method": event.httpMethod,
                "path": event.path
            }
            obj.res = {
                "json": (body) => {
                    callback(null, {
                        statusCode: obj.status || 200,
                        body: JSON.stringify(body)
                    })
                },
                "status": (status) => {
                    obj.status = status
                }
            }
            await obj.next(obj.nextCounter)
        },
        next: async () => {
            ++obj.nextCounter
            if (app[obj.mw[obj.nextCounter]]) {
                await app[obj.mw[obj.nextCounter]](obj.req, obj.res, obj.next)
                console.log("Hiii")
            } else {
                return
            }
        },
        app
    };
    obj.use(methods(obj.app))
    return obj
};
exports.api = api;
