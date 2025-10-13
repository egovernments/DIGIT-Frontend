/**
 * Middleware Configuration
 * Sets up common middleware and error handling
 */

const cors = require('cors');
const express = require('express');
const { serverLogger } = require('../utils/logger');

/**
 * Setup common middleware
 */
const setupMiddleware = (app) => {
  // Restrictive CORS configuration - allow only same server and authorized apps
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests without origin (same server)
      if (!origin) {
        return callback(null, true);
      }
      
      // Allow same origin (localhost/same server)
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      
      // Get allowed server URL and context paths from environment
      const allowedServerUrl = process.env.ALLOWED_SERVER_URL;
      const allowedContextPaths = process.env.ALLOWED_CONTEXT_PATHS; // Comma-separated paths like "console,workbench,admin"
      
      if (allowedServerUrl) {
        // Parse origin to check server and path
        try {
          const originUrl = new URL(origin);
          const allowedUrl = new URL(allowedServerUrl);
          
          // Check if server matches
          if (originUrl.hostname === allowedUrl.hostname && originUrl.port === allowedUrl.port) {
            // If no context paths specified, allow all paths on this server
            if (!allowedContextPaths) {
              return callback(null, true);
            }
            
            // Check if path matches allowed context paths
            const contextPaths = allowedContextPaths.split(',').map(path => path.trim());
            const originPath = originUrl.pathname.split('/')[1]; // Get first path segment
            
            if (contextPaths.includes(originPath)) {
              return callback(null, true);
            }
          }
        } catch (err) {
          serverLogger('error')(`Error parsing origin URL: ${origin}`, err.message);
        }
      }
      
      // Block all other origins
      serverLogger('warn')(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS - only same server and authorized app contexts are permitted'));
    },
    credentials: true, // Allow cookies and auth headers
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'kbn-xsrf']
  };
  
  app.use(cors(corsOptions));
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logging middleware
  app.use((req, res, next) => {
    serverLogger('info')(`${req.method} ${req.url}`);
    next();
  });
};

/**
 * Setup error handling middleware
 */
const setupErrorHandling = (app) => {
  app.use((err, req, res, next) => {
    serverLogger('error')('Unhandled error:', err.message);
    serverLogger('error')('Stack trace:', err.stack);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  });
};

module.exports = {
  setupMiddleware,
  setupErrorHandling
};