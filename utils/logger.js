const sanitize = (msg) => {
    if (typeof msg !== 'string') return msg;
    
    let sanitized = msg;
    // 1. Redact MongoDB connection strings (even complex ones)
    sanitized = sanitized.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)(@)/g, '$1$2:****$4');
    
    // 2. Redact typical sensitive keys in JSON or query strings
    const sensitiveKeys = ['password', 'secret', 'token', 'api_key', 'key', 'mongo_uri', 'access_token', 'refresh_token'];
    sensitiveKeys.forEach(key => {
        const regex = new RegExp(`("${key}"\\s*:\\s*)"([^"]+)"`, 'gi');
        sanitized = sanitized.replace(regex, '$1"****"');
        const eqRegex = new RegExp(`(${key}=)([^&\\s]+)`, 'gi');
        sanitized = sanitized.replace(eqRegex, '$1****');
    });

    // 3. Redact Authorization headers (Bearer tokens)
    sanitized = sanitized.replace(/(Bearer\s+)([a-zA-Z0-9.\-_]+)/gi, '$1****');

    return sanitized;
};

const logger = {
    sanitize: sanitize, // Exported for global interceptors
    info: (msg) => {
        if (process.env.NODE_ENV !== 'production' || msg.includes('Database')) {
            console.log(sanitize(msg));
        }
    },
    warn: (msg) => {
        console.warn(sanitize(msg));
    },
    error: (msg) => {
        console.error(sanitize(msg));
    },
    debug: (msg) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug(sanitize(msg));
        }
    }
};

module.exports = logger;
