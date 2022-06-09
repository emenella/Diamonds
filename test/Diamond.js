const { expect } = require("chai");

describe("Diamond Smart Contract", function () {

    let contract;
    let Diamond;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        contract = await ether.getContractFactory("DiamondFactory");
        [owner, addr1, addr2, ...addrs] = ether.getSigner();
        Diamond = await contract.deploy();
    });

    describe("Deploy Contract", function () {
        
    });

    describe("Add faceit", function () {

    });

    describe("Remove Facet", function () {

    });

    describe("Replace Facet", function () {

    });

});