const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Diamond", () => {
    let FacetCutAction = {
        Add: 0,
        Replace: 1,
        Remove: 2,
    }
    
    function getSelectors(contract) {
        const selectors = [];
        for (let key in contract.interface.functions) {
            selectors.push(ethers.utils.id(key).slice(0,10));
        }
        return selectors;
    }

    beforeEach("Diamond deploy", async () => {
        const DiamondFactory = await ethers.getContractFactory("Diamond");
            const DiamondCutFactory = await ethers.getContractFactory("DiamondCutFacet");
            const DiamondloupFactory = await ethers.getContractFactory("DiamondLoupeFacet");
            const ERC20Factory = await ethers.getContractFactory("ERC20Facet");
            const ERC173Factory = await ethers.getContractFactory("ERC173");
            const ERC165Factory = await ethers.getContractFactory("ERC165Facet");
            const InitalizeFactory = await ethers.getContractFactory("InitializeDiamond");
            const [deployer] = await ethers.getSigners();
            DiamondCut = await DiamondCutFactory.deploy();
            Diamond = await DiamondFactory.deploy(deployer.address, DiamondCut.address);
            Diamondloup = await DiamondloupFactory.deploy();
            ERC20 = await ERC20Factory.deploy();
            ERC173 = await ERC173Factory.deploy();
            ERC165 = await ERC165Factory.deploy();
            Initialize = await InitalizeFactory.deploy();
            diamondut = [
                {
                    facetAddress: Diamondloup.address,
                    action: FacetCutAction.Add,
                    functionSelectors: getSelectors(DiamondloupFactory)
                },
                {
                    facetAddress: ERC165.address,
                    action: FacetCutAction.Add,
                    functionSelectors: getSelectors(ERC165Factory)
                },
                {
                    facetAddress: ERC173.address,
                    action: FacetCutAction.Add,
                    functionSelectors: getSelectors(ERC173Factory)
                },
                {
                    facetAddress: ERC20.address,
                    action: FacetCutAction.Add,
                    functionSelectors: getSelectors(ERC20Factory)
                }
            ];
    });

    describe("DiamondCut add Facet", async () => {
        it("add a ERC20", async () => {
            const DiamondCutProxy = await ethers.getContractAt("IDiamondCut", Diamond.address);
            const params = ["DIamond", "DIA", ethers.utils.parseEther("10000"), ethers.utils.parseEther("100000000")];
            //get calldata
            const interface = Initialize.interface;
            const calldata = interface.encodeFunctionData("initialize",params);
            const tx = await DiamondCutProxy.diamondCut(diamondut, Initialize.address, calldata);
            const receipt = await tx.wait();
            expect(receipt.status).to.equal(1);
        });
    });

    describe("DiamondCut remove Facet", async () => {
        it("remove a ERC20", async () => {
            const DiamondCutProxy = await ethers.getContractAt("IDiamondCut", Diamond.address);
            const params = ["DIamond", "DIA", ethers.utils.parseEther("10000"), ethers.utils.parseEther("100000000")];
            //get calldata
            const interface = Initialize.interface;
            const calldata = interface.encodeFunctionData("initialize",params);
            const tx = await DiamondCutProxy.diamondCut(diamondut, Initialize.address, calldata);
            receipt = await tx.wait();
            const ERC20Factory = await ethers.getContractFactory("ERC20Facet");
            diamondStruct = [{
                facetAddress: ethers.constants.AddressZero,
                action: FacetCutAction.Remove,
                functionSelectors: getSelectors(ERC20Factory)
            }];
            const txs = await DiamondCutProxy.diamondCut(diamondStruct, ethers.constants.AddressZero, []);
            receipt = await txs.wait();
            expect(receipt.status).to.equal(1);
        })
    });
});
