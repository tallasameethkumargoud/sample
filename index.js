const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
app.use(express.json());

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Management API',
            version: '1.0.0',
            description: 'API for managing user data',
        },
        servers: [{ url: 'http://localhost:3000' }],
    },
    apis: ['./routes/*.js'], // files containing Swagger annotations
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

mongoose.connect('mongodb://localhost/userDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/user', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
