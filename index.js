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
        start: (event, context, callback) => {
            obj.mw = Object.keys(app)
            obj.req = {
                "body": event.body,
                "method": event.httpMethod,
                "path": event.path
            }
            obj.res = {
                "json": (body) => {
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify(body)
                    })
                }
            }
            obj.next(obj.nextCounter)
        },
        next: () => {
            ++obj.nextCounter
            if (app[obj.mw[obj.nextCounter]]) {
                app[obj.mw[obj.nextCounter]](obj.req, obj.res, obj.next)
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
