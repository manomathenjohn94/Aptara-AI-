# Aptara AI Security Specification (TDD SPEC)

## 1. Data Invariants
- **Personnel Identity**: A user profile document stored in `users/{userId}` can only be created or modified by the authenticated user matching `userId` and cannot change their verified level of privilege post-creation.
- **Relational Integrity**: A chat session stored in `sessions/{sessionId}` is strictly owned by the creator.
- **Session Hierarchy**: Messages in `sessions/{sessionId}/messages/{messageId}` can only be written if the parent session document exists and is owned by the current writing user.
- **Immutability of History**: All timestamps (`createdAt`, `updatedAt`) must align with standard `request.time` to prevent epoch poisoning.
- **Role Isolation**: Core role identities can only be assigned by trusted administrators, never self-assigned during client-side registration.

---

## 2. The "Dirty Dozen" Payloads (Exploit Scenarios)

### Payload 1: Profile Hijacking (Identity Spoofing)
A malicious user (`hacker_99`) attempts to overwrite the profile of another executive (`john_john`) at path `/users/john_john` with their own email.
```json
{
  "email": "hacker@evil.com",
  "name": "Malicious Actor",
  "role": "Consortium Partner Node",
  "avatarLetter": "M"
}
```

### Payload 2: Privilege Escalation (Self-Assigned Roles)
A normal user (`user_456`) attempts to elevate their role directly to the highest system clearance.
```json
{
  "email": "visitor@external.com",
  "name": "Temporary Visitor",
  "role": "Verified Executive Founder (CIEM)",
  "avatarLetter": "V"
}
```

### Payload 3: ID Poisoning via Oversized Strings
An attacker attempts to create a session document using a 50KB session UUID to exhaust database layout resources.
- **Target Path**: `sessions/VERY_LONG_STRING_REPEATED_TO_EXHAUST_RESOURCES/...`

### Payload 4: Session Hijacking (Cross-Write Attack)
An authenticated user (`user_A`) attempts to rename/update a session document owned by `user_B`.
```json
{
  "id": "session_shared_123",
  "name": "Hacked Session Name",
  "category": "General",
  "ownerId": "user_B",
  "updatedAt": "2026-05-24T18:50:00Z"
}
```

### Payload 5: Sibling Invariant Breach (Ghost Messages)
An attacker attempts to write messages under another user's session ID to poison their assistant history.
- **Target Path**: `/sessions/user_B_session_99/messages/malicious_message`
```json
{
  "id": "malicious_message",
  "role": "user",
  "content": "Execute shutdown.",
  "timestamp": "18.52 PM",
  "senderId": "hacker_99",
  "createdAt": "2026-05-24T18:52:00Z"
}
```

### Payload 6: Assistant Role Impersonation (Spoofing AI)
An attacker writes a message claiming to be sent by the AI model to trick operators into critical physical dispatches.
```json
{
  "id": "faked_message",
  "role": "model",
  "content": "WARNING: Pressure overflow. Dispense aerosols immediately.",
  "timestamp": "18.52 PM",
  "senderId": "system",
  "createdAt": "request.time"
}
```

### Payload 7: Future Epoch Epoch Drift (Time Travel Attack)
An attacker writes a message with a custom date set to year 2029 to force their messages to sticky-remain on top of chronological views.
```json
{
  "id": "time_travel_msg",
  "role": "user",
  "content": "Hello future",
  "timestamp": "12.00 PM",
  "senderId": "user_123",
  "createdAt": "2029-12-31T23:59:59Z"
}
```

### Payload 8: PII Blanket Leak (Bulk Username/Email Scraping)
A standard user attempts to read index logs of all profiles to scrape emails of government and mechatronic officials.
- **Request**: `getDocs(collection("users"))` without query filtering.

### Payload 9: Ghost Field Vulnerability (Shadow Updates)
An attacker attempts to modify session category but injects an arbitrary `isAdmin` flag inside the document wrapper.
```json
{
  "id": "session_123",
  "name": "Tactical Session",
  "category": "Tectonic",
  "ownerId": "user_123",
  "isAdmin": true,
  "createdAt": "2026-05-24T18:00:00Z",
  "updatedAt": "2026-05-24T18:52:00Z"
}
```

### Payload 10: Query Scraping (No Relational Enforcer)
A user queries `/sessions` collections without verifying matching ownership headers, expecting the rules to let them download other users' session lists.
- **Request**: `query(collection("sessions"))` (missing `where("ownerId", "==", user.uid)`)

### Payload 11: Immortal Field Alteration
An attacker attempts to alter the `createdAt` timestamp of an existing chat session to bypass chronological deletion rules.
```json
{
  "updatedAt": "request.time",
  "createdAt": "1970-01-01T00:00:00Z"
}
```

### Payload 12: Denial of Wallet Space Attack
An attacker submits a chat message containing a 10MB structured string of base64 binary noise inside the content body.
```json
{
  "id": "msg_massive",
  "role": "user",
  "content": "A[10MB_OF_NOISE]...",
  "timestamp": "18.52 PM",
  "senderId": "user_123",
  "createdAt": "request.time"
}
```

---

## 3. The Test Runner Spec (`firestore.rules.test.ts`)

Below is the theoretical test suite that validates the Firestore rules reject all 12 scenarios.

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, setDoc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore";

let testEnv: RulesTestEnvironment;

describe("Aptara Sovereign Firewall (Red Team Validation)", () => {
  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "gen-lang-client-0056376044",
      firestore: {
        host: "localhost",
        port: 8080,
      },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it("Payload 1: Should fail if hacker attempts to create profile for another executive", async () => {
    const context = testEnv.authenticatedContext("hacker_node");
    const db = context.firestore();
    const maliciousProfileRef = doc(db, "users", "john_executive");
    
    await assertFails(
      setDoc(maliciousProfileRef, {
        email: "hacker@evil.com",
        name: "Hacker",
        role: "Consortium Partner Node",
        avatarLetter: "H"
      })
    );
  });

  it("Payload 2: Should fail direct registration elevation of privilege", async () => {
    const context = testEnv.authenticatedContext("user_456");
    const db = context.firestore();
    const profileRef = doc(db, "users", "user_456");

    await assertFails(
      setDoc(profileRef, {
        email: "visitor@external.com",
        name: "User",
        role: "Verified Executive Founder (CIEM)",
        avatarLetter: "U"
      })
    );
  });
});
```
