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
  // CORS and body parsing
  app.use(cors());
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