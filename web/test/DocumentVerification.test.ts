import { ethers } from "hardhat";
import { expect } from "chai";

describe("DocumentVerification", function () {
  it("should store and verify document hash", async function () {
    const DocumentVerification = await ethers.getContractFactory("DocumentVerification");
    const documentVerification = await DocumentVerification.deploy();
    await documentVerification.waitForDeployment();

    const hash = ethers.keccak256(ethers.toUtf8Bytes("test-document"));
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create a signature (this is simplified for testing)
    const [signer] = await ethers.getSigners();
    const digest = ethers.TypedDataEncoder.hash(
      { name: "DocumentVerification", version: "1.0" },
      { Hash: [{ name: "hash", type: "bytes32" }] },
      { hash: hash }
    );
    const signature = await signer.signMessage(ethers.getBytes(digest));

    // Store document hash
    await documentVerification.storeDocumentHash(hash, timestamp, signature);
    
    // Verify document
    const result = await documentVerification.verifyDocument(hash, signer.address, signature);
    
    expect(result.success).to.be.true;
    expect(result.verified).to.be.true;
    expect(result.signatureValid).to.be.true;
  });

  it("should get document info", async function () {
    const DocumentVerification = await ethers.getContractFactory("DocumentVerification");
    const documentVerification = await DocumentVerification.deploy();
    await documentVerification.waitForDeployment();

    const hash = ethers.keccak256(ethers.toUtf8Bytes("test-document-2"));
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create a signature
    const [signer] = await ethers.getSigners();
    const digest = ethers.TypedDataEncoder.hash(
      { name: "DocumentVerification", version: "1.0" },
      { Hash: [{ name: "hash", type: "bytes32" }] },
      { hash: hash }
    );
    const signature = await signer.signMessage(ethers.getBytes(digest));

    // Store document hash
    await documentVerification.storeDocumentHash(hash, timestamp, signature);
    
    // Get document info
    const info = await documentVerification.getDocumentInfo(hash);
    
    expect(info.exists).to.be.true;
    expect(info.signer).to.equal(signer.address);
    expect(info.timestamp).to.equal(timestamp);
  });

  it("should check if user has document", async function () {
    const DocumentVerification = await ethers.getContractFactory("DocumentVerification");
    const documentVerification = await DocumentVerification.deploy();
    await documentVerification.waitForDeployment();

    const hash = ethers.keccak256(ethers.toUtf8Bytes("test-document-3"));
    const timestamp = Math.floor(Date.now() / 1000);
    
    // Create a signature
    const [signer] = await ethers.getSigners();
    const digest = ethers.TypedDataEncoder.hash(
      { name: "DocumentVerification", version: "1.0" },
      { Hash: [{ name: "hash", type: "bytes32" }] },
      { hash: hash }
    );
    const signature = await signer.signMessage(ethers.getBytes(digest));

    // Store document hash
    await documentVerification.storeDocumentHash(hash, timestamp, signature);
    
    // Check if user has document
    const hasDoc = await documentVerification.hasDocument(signer.address, hash);
    
    expect(hasDoc).to.be.true;
  });
});