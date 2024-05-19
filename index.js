import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const balanceButton = document.getElementById("balanceButton");
const ownerButton = document.getElementById("ownerButton");
const contractAddressButton = document.getElementById("contractAddressButton");
const enterRaffleButton = document.getElementById("enterRaffleButton");
const playerButton = document.getElementById("playerButton");
const winnerButton = document.getElementById("winnerButton");

connectButton.onclick = connect;
balanceButton.onclick = getBalace;
ownerButton.onclick = getOwner;
contractAddressButton.onclick = getContractAddress;
enterRaffleButton.onclick = enterRaffle;
playerButton.onclick = getPlayer;
winnerButton.onclick = getRecentWinner;

document.getElementById("playerButton").onclick = getPlayer;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      alert("You have connected to MetaMask");
    } catch (error) {
      console.log(error);
    }

    connectButton.innerHTML = "connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerHTML = "Please install MetaMask";
  }
}

async function getBalace() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      alert(
        `This contract's balance: ${ethers.utils.formatEther(balance)} ETH`
      );
      console.log(
        `This contract's balance: ${ethers.utils.formatEther(balance)} ETH`
      );
    } catch (e) {
      console.log(e);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
}

async function getOwner() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const owner = await contract.getOwner();
      alert(`The owner of this contract: ${owner}`);
      console.log(`The owner of this contract: ${owner}`);
    } catch (error) {
      console.log(error);
    }
  } else {
    ownerButton.innerHTML = "Please install MetaMask";
  }
}

async function getContractAddress() {
  if (typeof window.ethereum !== "undefined") {
    try {
      alert(`This contract's address: ${contractAddress}`);
      console.log(`This contract's address: ${contractAddress}`);
    } catch (e) {
      console.log(e);
    }
  } else {
    contractAddressButton.innerHTML = "Please install MetaMask";
  }
}

async function enterRaffle() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}...`);

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.enterRaffle({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
      alert("You've entered the raffle!");
    } catch (e) {
      console.log(e);
    }
  } else {
    enterRaffleButton.innerHTML = "Please install MetaMask";
  }
}

async function getPlayer() {
  const indexToCheck = document.getElementById("indexInput").value;

  if (!indexToCheck) {
    console.log("Please enter an index to reveal an address.");
    return;
  }

  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);

    try {
      const addressReturned = await contract.getPlayer(indexToCheck);
      console.log(`The adress ${addressReturned}, is player ${indexToCheck}`);
      alert(`The adress ${addressReturned}, is player ${indexToCheck}`);
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Please install MetaMask.");
  }
}

async function getRecentWinner() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const recentWinner = await contract.getRecentWinner();
      if (recentWinner == 0x0000000000000000000000000000000000000000) {
        alert("A winner hasn't been picked yet.");
        console.log("A winner hasn't been picked yet.");
      } else {
        alert(`The most recent lottery winner: ${recentWinner}`);
        console.log(`The most recent lottery winner: ${recentWinner}`);
      }
    } catch (error) {
      console.log(error);
    }
  } else {
    winnerButton.innerHTML = "Please install MetaMask";
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      );
      resolve();
    });
  });
}
