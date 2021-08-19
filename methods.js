const _m = {
    "get": "GET",
    "post": "POST",
    "patch": "PATCH",
    "delete": "DELETE",
    "update": "UPDATE"
}

const methods = (middlewares) => {
    const obj = {}
    Object.keys(_m).forEach((item) => {
        obj[item] = (path, middleware) => {
            middlewares[path + "-" + item] = (req, res, next) => {
                if (req.method === _m[item] && req.path === path) {
                    middleware(req, res, next)
                }
                next()
            };
        }
    })
    return obj
}

exports.methods = methods;