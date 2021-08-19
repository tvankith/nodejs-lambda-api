const methods = (app) => ({
    "get": (path, middleware) => {
        app[path + "get"] = (req, res, next) => {
            if (req.method === "GET" && req.path === path) {
                middleware(req, res, next)
            }
            next()
        };
    },
    "post": (path, middleware) => {
        app[path + "post"] = (req, res, next) => {
            if (req.method === "POST" && req.path === path) {
                middleware(req, res, next)
            }
            next()
        };
    },
})

exports.methods = methods;