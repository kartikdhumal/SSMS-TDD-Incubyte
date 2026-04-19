const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongo;

beforeAll(async () => {
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri);
});

// afterEach(async () => {
//   const collections = await mongoose.connection.db.collections();
//   for (const collection of collections) {
//     await collection.deleteMany({});
//   }
// });

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});
