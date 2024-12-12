Insurance Blockchain Platform

A blockchain-based insurance platform that handles policy management and claims processing using Ethereum smart contracts and MongoDB for off-chain data storage.

Project Structure:
insurance-blockchain/
├── docker/
│   └── docker-compose.yml # MongoDB container configuration
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── insuranceController.js
│   │   └── claimController.js
│   ├── models/
│   │   └── Insurance.js
│   ├── routes/
│   │   └── insuranceRoutes.js
│   ├── utils/
│   │   ├── blockchain.js
│   │   └── dbQueries.js
│   ├── tests/
│   │   └── database.test.js
│   └── app.js
├── .env
├── .gitignore
└── package.json

Prerequisites:
- Node.js (v14+)
- Docker and Docker Compose
- MongoDB
- Ethereum wallet (for testnet interactions)

Installation:
1. Clone the repository:
   `git clone <repository-url>`
   `cd insurance-blockchain`

2. Install dependencies:
   `npm install`

3. Set up environment variables (create a .env file)


4. Start MongoDB using Docker:
`cd docker`
`docker-compose up -d`

5. Start the application:
`npm run dev`

Database Schema:
Insurance Policy Schema


API Endpoints:
Insurance Policies:
- POST /api/insurance/policies - Create new policy
- GET /api/insurance/policies - Get all policies
- GET /api/insurance/policies/:id - Get policy by ID
- PUT /api/insurance/policies/:id - Update policy
- DELETE /api/insurance/policies/:id - Delete policy

Claims:
- POST /api/insurance/claims - Submit new claim
- PUT /api/insurance/claims/status - Update claim status
- GET /api/insurance/policies/:policyId/claims/:claimId - Get claim details

Database Queries:
- Find all policies: `await Insurance.find();`
- Find policy by number: `await Insurance.findOne({ policyNumber: 'POL123' });`
- Find policies by type: `await Insurance.find({ policyType: 'health' });`
- Find active policies: `await Insurance.find({ status: 'active' });`
- Find policies with claims: `await Insurance.find({'claims.0': { $exists: true }});`
- Find policies by holder name: `await Insurance.find({ holderName: { $regex: 'John', $options: 'i' }});`
- Find claims with specific status: `await Insurance.find({ 'claims.status': 'PENDING' });`

Testing:
Run database tests:
`npm test`

MongoDB Connection:
Using MongoDB Compass:
Connection String: `mongodb://root:rootpassword@localhost:27017/insurance?authSource=admin`

Using MongoDB CLI:
`mongo mongodb://root:rootpassword@localhost:27017/insurance?authSource=admin`

Blockchain Integration:
The platform integrates with Ethereum blockchain for:
- Storing hashed customer IDs
- Recording claim submissions
- Tracking claim status updates
- Verifying policy and claim data

Smart Contract Interaction:
The `blockchain.js` utility handles:
- Customer ID hashing
- Claim data formatting
- Transaction signing
- Status verification

Scripts:
- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run database tests
- `npm run query` - Run database query examples

Docker:
MongoDB container configuration


Contributing:
- Fork the repository
- Create your feature branch
- Commit your changes
- Push to the branch
- Create a new Pull Request

License:
MIT License




