import winston from "winston";

function log() {
    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({ filename: "uncaughtExceptions.log"}));
    
    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    winston.add(
        new winston.transports.File({
            filename: "logfile.log"
        })
    );

    winston.add(
        new winston.transports.Console()
    );
}

export { log };