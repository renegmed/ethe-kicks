const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;           // array of accounts created by ganache
let factory;            // the deployed CampaignFactory contract
let campaignAddress;    // the campaign address (the first among possible accounts) created by factory
let campaign;           // a campaign with above campaign address, campaignAddress

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // converts JSON factory ABI into compiled byte code
        .deploy({ data: compiledFactory.bytecode})                                  
        .send({ from: accounts[0], gas: '1000000'});                // use the first ganache account as the owner of the campaign
    
    // minimum contribution would be 100 wei    
    await factory.methods.createCampaign('100').send({   // send because transaction tries to modify some data on the blockchain    
        from: accounts[0],
        gas: '1000000'
    });    

    // get the deployed factory campaigns 
    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();  // use call because it is just getting data and no data is changed
    // [campaignAddress] means an array is returned, then just get the first element and save it to variable campaignAddress

    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),     // ABI for the campaign deployed
        campaignAddress                             //  address of the already deployed version campaign (by factory object above)
    );    
});



describe('Campaigns', () => {

    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });
    
    it('marks caller as the campaign manager', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('allows people to contribute money and marks them as approvers', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('requires a mnimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
                value: '5',
                from: account[1]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('it allows manager to make a payment request', async () => {
        await campaign.methods
            .createRequest('Buy batteries', '100', accounts[1])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        
        const request = await campaign.methods.requests(0).call();
        
        assert.equal('Buy batteries', request.description);
    });

    it('processes requests', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods
            .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
            .send({from: accounts[0], gas: '1000000' });
        
        await campaign.methods.approveRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });    

        await campaign.methods.finalizeRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });

        let balance = await web3.eth.getBalance(accounts[1]);
        // use let because balance value will be changed later

        balance = web3.utils.fromWei(balance, 'ether');
        balance = parseFloat(balance);

        // Note that ganache will not reset in beforeEach section. Be aware that ganache accounts will not reset their ether on each test call.
        console.log(balance);

        assert(balance > 104, `the actual balance is ${balance} where 105 is expected`);
    });
});
