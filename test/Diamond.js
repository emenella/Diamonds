const {expect, chai} = require("chai");
const { ethers } = require("hardhat");

describe("Diamond Smart Contract", function () {

    let contract;
    let Diamond;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    const FacetCutAction = {
        Add: 0,
        Replace: 1,
        Remove: 2,
    };

    function getSelectors(contract) {
        const signatures = [];
        for(const key of Object.keys(contract.functions)) {
            signatures.push(utils.keccak256(utils.toUtf8Bytes(key)).substr(0, 10));
        }
    
        return signatures;
    }

    
    beforeEach(async function () {
        diamond = await ethers.getContractFactory("Diamond");
        diamondCut = await ethers.getContractFactory("DiamondCut");
        erc20 = await ethers.getContractFactory("DiamondLouper");
        diamondLouper = await ethers.getContractFactory("ERC20");
        [owner, addr1, addr2, ...addrs] = ethers.getSigner();
        DiamondCut = diamondCut.deploy();
        DiamondLouper = diamondLouper.deploy();
        erc20Contract = erc20.deploy();
        Diamond = await diamond.deploy(owner, DiamondCut.address);
        diamondCut = [
            {
                action: FacetCutAction.Add,
                facetAddress: DiamondLouper.address,
                functionSelectors: getSelectors(diamondLouper)
            },
            {
                action: FacetCutAction.Add,
                facetAddress: erc20.address,
                functionSelectors: getSelectors(erc20)
            },
        ];
    });
    
    describe("Deploy Contract", async function () {
        it("should deploy the contract", async function () {
            await Diamond.Cut(diamondCut);
        });
    });

    describe("Add faceit", function () {

    });

    describe("Remove Facet", function () {

    });

    describe("Replace Facet", function () {

    });

});