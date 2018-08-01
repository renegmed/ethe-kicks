
// Split the compiled file into two - Campaign and Campaign Factory

const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');

// remove existing build/ directory
fs.removeSync(buildPath);

// Compile Campaign.sol that would produce 2 contract ABI files and place in build/ directory
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solc.compile(source, 1).contracts;


// check if directory exists. if not create a new directory
fs.ensureDirSync(buildPath);

//console.log(output);

// Rename files xxxx: into xxxx.json
for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}