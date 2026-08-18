const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * ========================================================================
 *  1. API ROUTE PROXIES
 * ========================================================================
 */

// AUTH SERVICE
app.use('/api/v1/auth', createProxyMiddleware({ 
    target: process.env.AUTH_SERVICE_URL || 'http://auth-service:3001', 
    changeOrigin: true,
    onError: (err, req, res) => res.status(503).json({ error: 'Auth Service Unavailable' })
}));

// EXPLORER SERVICE (Matching Flutter & Android client apps)
app.use('/api/v1/explorer', createProxyMiddleware({ 
    target: process.env.EXPLORER_SERVICE_URL || 'http://explorer-service:4003', 
    changeOrigin: true,
    onError: (err, req, res) => res.status(503).json({ error: 'Explorer Service Unavailable' })
}));

// URL BUILDER SERVICE
app.use('/api/v1/tools', createProxyMiddleware({ 
    target: process.env.URL_BUILDER_SERVICE_URL || 'http://url-builder-service:3002', 
    changeOrigin: true,
    onError: (err, req, res) => res.status(503).json({ error: 'URL Builder Service Unavailable' })
}));

// EMAIL SERVICE
app.use('/api/v1/email', createProxyMiddleware({ 
    target: process.env.EMAIL_SERVICE_URL || 'http://email-service:3003', 
    changeOrigin: true,
    pathRewrite: { '^/api/v1/email': '' },
    onError: (err, req, res) => res.status(503).json({ error: 'Email Service Unavailable' })
}));

/**
 * ========================================================================
 *  2. SWAGGER JSON PROXIES & UI
 * ========================================================================
 */
app.use('/docs/auth/json', createProxyMiddleware({ 
    target: 'http://auth-service:3001/swagger.json', 
    changeOrigin: true,
    pathRewrite: { '^/docs/auth/json': '' } 
}));

const swaggerOptions = {
    explorer: true,
    swaggerOptions: {
        urls: [
            { url: '/docs/auth/json', name: 'Auth Service' }
        ]
    }
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, swaggerOptions));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});