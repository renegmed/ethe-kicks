import Web3 from 'web3';

//const web3 = new Web3(window.web3.currentProvider);  
// NOTE: using this, window would not be available in nodejs since window object is on the server side. 
// The solution below would check if the user is using a browser with metamask installed so it can grab the web3


let web3; // let -to be able to reassign this variable

if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {  // executed in a browser and metamask installed in a browser
    // We are in the browser and metamask is running.
    web3 = new Web3(window.web3.currentProvider);
} else {
    // We are on the server OR the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'URL OF INFURA HERE'
    );
    
    web3 = new Web3(provider);
}

export default web3;