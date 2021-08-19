const { methods } = require("./methods");
const { uuidv4 } = require("./uuid");

const api = () => {
    let middlewares = {};
    let obj = {
        req: {},
        res: {
            "status": (status) => {
                obj.status = status
            }
        },
        mw: [],
        use: (mw) => {
            if (typeof mw === "object") {
                obj = { ...mw, ...obj }
            } else if (typeof mw === "function") {
                middlewares[uuidv4] = mw
            }
        },
        handle: (event, context, callback) => {
            obj.nextCounter = -1
            obj.mw = Object.keys(middlewares)
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
            obj.next(obj.nextCounter)
        },
        next: () => {
            ++obj.nextCounter
            if (middlewares[obj.mw[obj.nextCounter]]) {
                middlewares[obj.mw[obj.nextCounter]](obj.req, obj.res, obj.next)
            } else {
                return
            }
        },
        middlewares
    };
    obj.use(methods(obj.middlewares))
    return obj
};
exports.api = api;
