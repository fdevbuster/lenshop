#!/usr/bin/env tsx

import { privateKeyToAccount, generatePrivateKey } from "viem/accounts";

const privateKey = generatePrivateKey();
const account = privateKeyToAccount(privateKey);

console.log("Private Key:", privateKey);
console.log("Address:", account.address);