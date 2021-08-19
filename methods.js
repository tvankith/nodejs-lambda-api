const _m = {
    "get": "GET",
    "post": "POST",
    "patch": "PATCH",
    "delete": "DELETE",
    "update": "UPDATE"
}

const setMethodMiddlewares = (obj) => {
    for(let item in _m) {
        obj[item] = (path, middleware) => {
            ++obj.middleWareCount
            const key = String(obj.middleWareCount)
            const middlewares = obj.middlewares
            middlewares[key] = {}
            middlewares[key]["function"] = async (req, res, next) => {
                if (req.method === _m[item] && req.path === path) {
                    await middleware(req, res, next)
                } else {
                    next()
                }
            }
            middlewares[key]["order"] = String(obj.middleWareCount + 1)
            middlewares[key]["description"] = item + path
        }
    }
    return obj
}

exports.setMethodMiddlewares = setMethodMiddlewares