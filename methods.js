const _m = {
    "get": "GET",
    "post": "POST",
    "patch": "PATCH",
    "delete": "DELETE",
    "update": "UPDATE"
}

const methods = (app) => {
    const obj = {}
    Object.keys(_m).forEach((item) => {
        obj[item] = (path, middleware) => {
            app[path + "-" + item] = async (req, res, next) => {
                if (req.method === _m[item] && req.path === path) {
                    await middleware(req, res, next)
                }
                await next()
            };
        }
    })
    return obj
}

exports.methods = methods;