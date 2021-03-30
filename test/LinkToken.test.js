// Load dependencies
const { accounts, contract, provider } = require('@openzeppelin/test-environment');
const { expect } = require('chai');

// Load compiled artifacts
const { LinkToken } = require('@chainlink/contracts/truffle/v0.4/LinkToken');
const { Oracle } = require('@chainlink/contracts/truffle/v0.4/Oracle');

LinkToken.setProvider('http://localhost:7545');
Oracle.setProvider(provider);

// Start test block
describe('LinkToken', function () {

    const [creator] = accounts;

    beforeEach(async function () {
        // set up Chainlink
        link = await LinkToken.new({ from: creator });
        oc = await Oracle.new(link.address, { from: creator });
    });

    // Test case
    it('retrieve name', async function () {
        expect(await link.name()).to.equal('ChainLink Token');
    });
});