const express = require('express');
const mongoose = require('mongoose');
const Web3 = require('web3');
require('dotenv').config();
const PoolInteractions = require('./artifacts/contracts/PoolInteractions.sol/PoolInteractions.json');



const app = express();
app.use(express.json());
const web3 = new Web3(process.env.STAGING_INFURA_URL);

// Connect to MongoDB database
mongoose.connect('mongodb+srv://tatiana0borda:BornToDie-2927@cluster0.yi50meq.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Load smart contract ABI
const contractAbi = PoolInteractions.abi;
const contractAddress = '0xEd0430383d15540d87002ad30b4b5f0381dab1f8';
const myContract = new web3.eth.Contract(contractAbi, contractAddress);

// Define deposit schema and model
const depositSchema = new mongoose.Schema({
  userAddress: String,
  pool: String,
  tokenAddress: String,
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});
const Deposit = mongoose.model('Deposit', depositSchema);

// Define API endpoints
app.post('/deposit', async (req, res) => {
  try {
    const { userAddress, pool, tokenAddress, amount } = req.body;

    // Approve token for spending by the smart contract
    const token = new web3.eth.Contract(PoolInteractions.abi, tokenAddress);
    const approveTx = await token.methods.approve(contractAddress, amount).send({ from: userAddress });

    // Deposit tokens into Aave pool
    const depositTx = await myContract.methods.supplyLiquidity(tokenAddress, amount).send({ from: userAddress });

    // Save deposit to MongoDB
    const deposit = new Deposit({ userAddress, pool, tokenAddress, amount });
    await deposit.save();

    res.send({ success: true, txHashes: [approveTx.transactionHash, depositTx.transactionHash] });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
});

app.get('/deposit-history', async (req, res) => {
  try {
    const deposits = await Deposit.find();
    res.send({ success: true, deposits });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
});

app.get('/pools', async (req, res) => {
  try {
    const pools = await myContract.methods.getReservesList().call();
    res.send({ success: true, pools });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
});

// Start the server
app.listen(5000, () => console.log('Server started on port 5000'));
