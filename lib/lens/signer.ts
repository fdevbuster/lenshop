import { LENS_ACCOUNT } from "@/config/viem.config";
import { privateKeyToAccount,  } from "viem/accounts";

export const signer = privateKeyToAccount(LENS_ACCOUNT);