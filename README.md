# iDeliverAPI

iDeliverAPI is a RESTful API that provides endpoints for a grocery market app. The API is built with Node.js, Express, and MongoDB.

# Installation

To install iDeliverAPI, follow these steps:

1. Clone the repository to your local machine.
2. Run npm install to install all dependencies.
3. Create a .env file in the root directory and add the following environment variables:

```
PORT
JWT_SECRET
ATLAS_URI
```

4. Run npm start to start the server.

# Endpoints

### Authentication

'POST /api/v1/auth/register': Register a new user.

'POST /api/v1/auth/login': Login a user.

# License

This project is licensed under the MIT License. See the LICENSE file for details.