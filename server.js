// --- GLOBAL SECURITY INTERCEPTOR (Redacts secrets from Node.js warnings) ---
// Must be at the absolute top before any other imports
process.removeAllListeners('warning'); 
process.on('warning', (warning) => {
  if (warning.message) {
    // We require the sanitizer here to avoid early require issues
    const { sanitize } = require('./utils/logger');
    const sanitizedMsg = sanitize(warning.message);
    process.stderr.write(`(node:${process.pid}) Warning: ${sanitizedMsg}\n`);
  }
});

const logger = require('./utils/logger');
const config = require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const SocketServer = require('./socketServer');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

app.use(express.json())
app.use(helmet());
app.use(compression());

const isProd = config.env === 'production';
const allowedOrigins = (config.client_url || '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const corsOptions = isProd
  ? {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, '');
        if (allowedOrigins.includes(normalized) || normalized.endsWith('.netlify.app')) {
          return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }
  : {
      origin: true,
      credentials: true,
    };

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser())

//#region // !Socket
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: corsOptions
});

io.on('connection', socket => {
  SocketServer(socket);
})
//#endregion

//#region // !Routes
app.use('/api', require('./routes/authRouter'));
app.use('/api', require('./routes/userRouter'));
app.use('/api', require('./routes/postRouter'));
app.use('/api', require('./routes/commentRouter'));
app.use('/api', require('./routes/adminRouter'));
app.use('/api', require('./routes/notifyRouter'));
app.use('/api', require('./routes/messageRouter'));
app.use('/api', require('./routes/aiRouter'));
//#endregion

app.get('/', (req, res) => {
  res.json({ msg: "SocioMatrix Server is running!" });
});

// Serving static files in production (non-API routes)
if (isProd) {
  const path = require('path');
  app.use(express.static(path.join(__dirname, 'client', 'build')));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).end();
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error(err.message, { stack: isProd ? null : err.stack });
  const status = err.status || 500;
  const message = isProd ? "An internal server error occurred." : err.message;
  res.status(status).json({ msg: message });
});

mongoose.connect(config.mongo_uri, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}, err => {
  if (err) {
      logger.error("Database connection failed.");
      process.exit(1);
  }
  logger.info("Database connected successfully.");
})

const port = config.port;
http.listen(port, () => {
  logger.info(`Server is listening on port ${port}`);
});
