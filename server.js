// const mkcert = require('mkcert');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');

// fs.readFileSync('')

process.on('uncaughtException', err => {
  console.log("UNCAUGHT REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({
  path: './config.env'
});
const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log('DB connection successful');
});

// //Then create the certificate
// mkcert.createCert({
//   domains: ['127.0.0.1', 'localhost'],
//   validityDays: 365,
//   caKey: ca.key,
//   caCert: ca.cert
// })
// .then((cert)=> {
//   console.log(cert.key, cert.cert);
 
//   //Create a full chain certificate by merging CA and domain certificates
//   console.log(`${cert.cert}\n${ca.cert}`);
// })
// .catch(err=> console.error(err));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});