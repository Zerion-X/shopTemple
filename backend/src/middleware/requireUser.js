function requireUser(req, res, next) {
    if (!req.user) return res.status(401).send("Login required");

    next();
}

export {requireUser};