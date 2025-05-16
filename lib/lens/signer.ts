import { APP_SIGNER_KEY } from "@/config/viem.config";
import { privateKeyToAccount,  } from "viem/accounts";

export const signer = privateKeyToAccount(APP_SIGNER_KEY);