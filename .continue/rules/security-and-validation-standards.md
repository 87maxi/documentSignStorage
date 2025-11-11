---
globs: |-
  src/hooks/**/*.{ts,tsx}
  src/lib/**/*.{ts,tsx}
description: Ensure blockchain security by validating all addresses with
  checksum, prevent UI blocking by using Web Workers for intensive operations
  like file hashing, and implement robust error handling for all contract
  interactions to maintain application stability.
alwaysApply: true
---

All Ethereum addresses must be validated using viem's isAddress function with checksum validation. All file operations must be performed in Web Workers to prevent UI blocking. All contract calls must have proper error handling and timeout mechanisms.