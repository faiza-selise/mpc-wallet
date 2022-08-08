const mongoose = require('mongoose');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
var Cryptoapis = require('cryptoapis');
var dex = require("./openOcean.dex");


let server;
mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

// open ocean
//console.log(dexApis.FetchTokenList);

// Generate Wallet
var defaultClient = Cryptoapis.ApiClient.instance;
var ApiKey = defaultClient.authentications['ApiKey'];
ApiKey.apiKey = "3eb2121b10168820303ccf04a43ced37451a7144"


let apiInstanceGenerateApi = new Cryptoapis.GeneratingApi();
let blockchain = "ethereum"; // String | Represents the specific blockchain protocol name, e.g. Ethereum, Bitcoin, etc.
let network = "ropsten"; // String | Represents the name of the blockchain network used; blockchain networks are usually identical as technology and software, but they differ in data, e.g. - \"mainnet\" is the live network with actual data while networks like \"testnet\", \"ropsten\" are test networks.
let walletId = "62f09c1b63aea9000868a996"; // String | Represents the unique ID of the specific Wallet.
let optsForWalletGen = {
  'generateDepositAddressRB': new Cryptoapis.GenerateDepositAddressRB({
    item : {
      label: "testlabel"
    } 
  })
};
// apiInstanceGenerateApi.generateDepositAddress(blockchain, network, walletId, optsForWalletGen).then((data) => {
//   console.log('API called successfully. Returned data: ' + data.data.item.address);
// }, (error) => {
//   console.error(error);
// });



let apiInstanceForTxn = new Cryptoapis.TransactionsApi();
let address = "0x4516F615331C3d86a6BdA0d0E568D52c2d063931"; 
// Transaction fungible tokens
let opts = {
  'createFungibleTokensTransactionRequestFromAddressRB': new Cryptoapis.CreateFungibleTokensTransactionRequestFromAddressRB({
    item: {
      amount: "0.00490",
      feePriority: "standard",
      note: "yourAdditionalInformationhere",
      recipientAddress: "0xfE63903132e02768006B9f5434ecCbe2e68B3412",
      tokenIdentifier: "0xdac17f958d2ee523a2206206994597c13d831ec7"
  }
  }) 
};
// apiInstanceForTxn.createFungibleTokensTransactionRequestFromAddress(blockchain, network, address, walletId, opts).then((data) => {
//   console.log('API called successfully. Returned data: ' + data);
// }, (error) => {
//   console.error(error);
// });

// Transaction from coin transfer
let optsForCoinTransfer = {
  'context': "test",
  'createCoinsTransactionRequestFromAddressRB': new Cryptoapis.CreateCoinsTransactionRequestFromAddressRB({
    item : {
      amount: "0.00490",
      feePriority: "standard",
      recipientAddress: "0xfE63903132e02768006B9f5434ecCbe2e68B3412"
  
    }

  }) // CreateCoinsTransactionRequestFromAddressRB | 
};
// apiInstanceForTxn.createCoinsTransactionRequestFromAddress(address, blockchain, network, walletId, optsForCoinTransfer).then((data) => {
//   console.log('API called successfully. Returned data: ' + data);
// }, (error) => {
//   console.error(error);
// });








const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});


