import winston from "winston";

function error(err, req, res, next) {
    winston.error(err.message, err);

    res.status(500).send('Something failed.');
}

export { error };