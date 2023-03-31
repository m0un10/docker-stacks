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

const server = new grpc.Server();

server.addService(helloworld.Greeter.service, {
  SayHello: (call, callback) => {
    callback(null, { message: 'Hello, ' + call.request.name });
  },
});

server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('Server started on 0.0.0.0:50051');
  server.start();
});

