import winston from 'winston'
const { printf, combine, timestamp, label, prettyPrint } = winston.format;

const logFormat = printf(({ level, timestamp, label, type, message, stack }) => {
    return `${timestamp} [${label}] [${level}] [${type}]: ${stack}`;
})

export const serverLogger = winston.createLogger({
    level: 'http',
    // format: winston.format.json(),
    format: combine(
        timestamp(),
        label({ label: 'Server' }),
        prettyPrint(),
        logFormat
    ),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: './logs/serverErrors.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' })
    ]
})

export const frontendLogger = winston.createLogger({
    level: 'http',
    // format: winston.format.json(),
    format: combine(
        timestamp(),
        label({ label: 'Front-end' }),
        prettyPrint(),
        logFormat
    ),
    // defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: './logs/frontendErrors.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' })
    ]
})

if(process.env.NODE_ENV !== 'production') {
    // This will log all the winston errors to the console in development mode only
    serverLogger.add(new winston.transports.Console({
        format: combine(
            timestamp(),
            label({ label: 'Server' }),
            prettyPrint(),
            logFormat
        ),
    }))

    frontendLogger.add(new winston.transports.Console({
        format: combine(
            timestamp(),
            label({ label: 'Front-end' }),
            prettyPrint(),
            logFormat
        ),
    }))
}