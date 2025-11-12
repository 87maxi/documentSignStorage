// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract DocumentVerification {
    event DocumentStored(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp,
        uint256 blockNumber
    );

    event DocumentRevoked(
        bytes32 indexed hash,
        address indexed signer,
        uint256 timestamp
    );

    struct Document {
        address signer;
        uint256 timestamp;
        uint256 blockNumber;
        bool revoked;
    }

    mapping(bytes32 => Document) private documents;
    mapping(address => mapping(bytes32 => bool)) private userDocuments;

    // Store document hash with signer, timestamp, and signature
    function storeDocumentHash(
        bytes32 hash,
        uint256 timestamp,
        bytes calldata signature
    ) external {
        // Verify signature (this is a simplified version)
        require(_verifySignature(hash, msg.sender, signature), "Invalid signature");
        
        // Store document if not already exists
        if (!documents[hash].revoked && documents[hash].timestamp != 0) {
            revert("Document already exists");
        }
        
        documents[hash] = Document({
            signer: msg.sender,
            timestamp: timestamp,
            blockNumber: block.number,
            revoked: false
        });
        
        userDocuments[msg.sender][hash] = true;
        
        emit DocumentStored(hash, msg.sender, timestamp, block.number);
    }

    // Verify document existence, signer, and signature
    function verifyDocument(
        bytes32 hash,
        address signer,
        bytes calldata signature
    ) external view returns (
        bool success,
        bool verified,
        bool signatureValid,
        uint256 blockNumber,
        uint256 timestamp
    ) {
        Document storage doc = documents[hash];
        
        // Check if document exists and is not revoked
        if (doc.timestamp == 0 || doc.revoked) {
            return (false, false, false, 0, 0);
        }
        
        // Check signer
        if (doc.signer != signer) {
            return (false, false, false, doc.blockNumber, doc.timestamp);
        }
        
        // Verify signature
        bool isValid = _verifySignature(hash, signer, signature);
        
        return (
            true,
            true,
            isValid,
            doc.blockNumber,
            doc.timestamp
        );
    }

    // Get document information
    function getDocumentInfo(bytes32 hash)
        external
        view
        returns (
            bool exists,
            address signer,
            uint256 timestamp,
            uint256 blockNumber
        )
    {
        Document storage doc = documents[hash];
        if (doc.timestamp == 0 || doc.revoked) {
            return (false, address(0), 0, 0);
        }
        
        return (
            true,
            doc.signer,
            doc.timestamp,
            doc.blockNumber
        );
    }

    // Check if user has document
    function hasDocument(address user, bytes32 hash)
        external
        view
        returns (bool)
    {
        return userDocuments[user][hash];
    }

    // Internal function to verify signature
    function _verifySignature(
        bytes32 hash,
        address signer,
        bytes calldata signature
    ) internal pure returns (bool) {
        // This is a simplified version - in production, you would verify the signature
        // using ECDSA.recover or a similar mechanism
        bytes32 messageHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        
        // Extract v, r, s from signature
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        // Check signature length
        if (signature.length != 65) {
            return false;
        }
        
        // Extract r, s, v from the signature
        // solhint-disable-next-line no-inline-assembly
        assembly {
            r := calldataload(add(signature.offset, 32))
            s := calldataload(add(signature.offset, 64))
            v := and(
                calldataload(add(signature.offset, 65)),
                0xff
            )
        }
        
        // Adjust v value if needed
        if (v < 27) {
            v += 27;
        }
        
        // Validate s value (malleability check)
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            return false;
        }
        
        // Recover signer
        address recovered = ecrecover(messageHash, v, r, s);
        
        return recovered == signer;
    }
}