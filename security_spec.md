# Security Specification for travel-planner Firestore Database

## 1. Data Invariants
1. A shared travel itinerary must have a destination name defined as a string between 1 and 200 characters.
2. The travel duration must be an integer between 1 and 30 days inclusive.
3. Once created, a shared itinerary is immutable. It cannot be updated or deleted by any user.
4. No collection queries or collection lists are allowed. Shared keys are retrieved strictly via their single document ID (`get`).

## 2. The "Dirty Dozen" Malicious Payloads
These payloads attempt to bypass identity, integrity, data types, and temporal correctness. All MUST be denied.

1. **Massive Value Poisoning**: `destination` field is a 2MB string.
2. **Type Overwrite**: `durationDays` is set as a boolean or float.
3. **Invalid Duration Field Range**: `durationDays` set to `999` or `-5`.
4. **Missing Destination Parameter**: Creating a document without a `destination` key.
5. **No Entity Rule Breach**: Forging unauthorized helper keys or ghost fields (e.g., `isAdmin: true` inside document body).
6. **Path Variable Pollution**: Document ID in the URI is a 2KB string of custom script paths.
7. **Write Access Infiltration**: Trying to update or overwrite an existing shared itinerary document.
8. **Malicious Administrative Deletion**: Direct client request to delete a shared itinerary identifier.
9. **No Auth Collection Listing**: Trying to perform `getDocs` list queries on `shared_itineraries` to extract all user trip designs.
10. **Array Poisoning Attack**: Injecting a 100,000 element array as day itineraries to trigger out-of-memory or Denial-of-Wallet reads.
11. **Negative Budget Injection**: Budget values are negative.
12. **Tampered Flag Injection**: Injecting spoofed metadata parameters like arbitrary raw platform attributes.

## 3. Security Rules Tests Verification Spec

Verifies that the ruleset successfully returns `PERMISSION_DENIED` on the dirty dozen inputs.
- Single Document lookup (`get`) is allowed if path is clean and document exists.
- List query (`list`) returns permission denied.
- Create operation validates structure, size, and schema types.
- Update and Delete operations always fail.
