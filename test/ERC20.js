const {expect} = require("chai");
const {ethers} = require("hardhat");

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


describe("Diamond", () => {
    it("Diamond with ERC20 facet", async() => {

        const DiamondFactory = await ethers.getContractFactory("Diamond");
        const DiamondloupFactory = await ethers.getContractFactory("DiamondLoupeFacet");
        const ERC20Factory = await ethers.getContractFactory("ERC20Facet");
        const ERC173Factory = await ethers.getContractFactory("ERC173");
        const ERC165Factory = await ethers.getContractFactory("ERC165Facet");
        const InitalizeFactory = await ethers.getContractFactory("InitializeDiamond");
        const DiamondCutFactory = await ethers.getContractFactory("DiamondCutFacet");

        const [deployer, addr1, addr3, ... addrs] = await ethers.getSigners();

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

        const params = ["DIamond", "DIA", ethers.utils.parseEther("10000"), ethers.utils.parseEther("100000000")];
        const DiamondCutProxy = await ethers.getContractAt("IDiamondCut", Diamond.address);
        const interface = Initialize.interface;
        const calldata = interface.encodeFunctionData("initialize",params);
        const tx = await DiamondCutProxy.diamondCut(diamondut, Initialize.address, calldata);
        receipt = await tx.wait();
        expect(receipt.status).to.equal(1);

        describe("ERC20 Test", async () => {

            const ERC20Proxy = await ethers.getContractAt("IERC20", Diamond.address);
            // complex test ERC20
            it("ERC20 balanceOf", async () => {
                const balance = await ERC20Proxy.balanceOf(deployer.address);
                expect(balance).to.equal(ethers.utils.parseEther("10000"));
            }).timeout(10000);
            it("ERC20 transfer", async () => {
                const tx = await ERC20Proxy.transfer(addr1, ethers.utils.parseEther("1000"));
                const receipt = await tx.wait();
                expect(receipt.status).to.equal(1);
                const balance = await ERC20Proxy.balanceOf(addr1);
                expect(balance).to.equal(ethers.utils.parseEther("1000"));
            });
            it("ERC20 transferFrom", async () => {
                const tx = await ERC20Proxy.transferFrom(deployer.address, addr1, ethers.utils.parseEther("1000"));
                const receipt = await tx.wait();
                expect(receipt.status).to.equal(1);
                const balance = await ERC20Proxy.balanceOf(addr1);
                expect(balance).to.equal(ethers.utils.parseEther("1000"));
            });
            it("ERC20 approve", async () => {
                const tx = await ERC20Proxy.approve(addr1, ethers.utils.parseEther("1000"));
                const receipt = await tx.wait();
                expect(receipt.status).to.equal(1);
                const allowance = await ERC20Proxy.allowance(deployer.address, addr1);
                expect(allowance).to.equal(ethers.utils.parseEther("1000"));
            });
            it("ERC20 transferFrom", async () => {
                const tx = await ERC20Proxy.transferFrom(deployer.address, addr1, ethers.utils.parseEther("1000"));
                const receipt = await tx.wait();
                expect(receipt.status).to.equal(1);
                const balance = await ERC20Proxy.balanceOf(addr1);
                expect(balance).to.equal(ethers.utils.parseEther("1000"));
            });


        });



    });
});