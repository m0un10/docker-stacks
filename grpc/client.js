const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const packageDefinition = protoLoader.loadSync(path.join(__dirname, 'helloworld.proto'), {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const helloworld = protoDescriptor.helloworld;

const client = new helloworld.Greeter('server:50051', grpc.credentials.createInsecure());

client.SayHello({ name: 'World' }, (error, response) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Response:', response.message);
  }
});

