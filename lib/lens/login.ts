"use client";

import { client } from "./client";
import { signMessageWith } from "@lens-protocol/client/viem";
import { signer } from "./signer";
import { Ok } from "@lens-protocol/react";
import { ok } from "assert";


export const login = async (account:`0x${string}`) => {
    const authenticated = await client.login({
        onboardingUser: {
          app: '0xB2274E29D0685bF4979F2510c4D4f4E5E93D24AD',
          wallet: account,
        },
        signMessage: (...args)=>{
            console.log('signing message', args)
            return signMessageWith(signer)(...args); 
        },
      });
      
      if (authenticated.isErr()) {
        return console.error(authenticated.error);
      }
      
      // SessionClient: { ... }
      const sessionClient = authenticated.value;
      console.log('sessionClient', sessionClient);
      const authUser = sessionClient.getAuthenticatedUser()
      if(authUser.isOk()){
        sessionStorage.setItem('lens-session',JSON.stringify(authUser.value))

      }
      
      //sessionStorage.setItem("lens-session", JSON.stringify(sessionClient));
      return sessionClient;
}


export const isLoggedIn = () => {
    if(typeof(sessionStorage) === "undefined"){
        return false;
    }
    const sessionClient = sessionStorage.getItem("lens-session");
    if (!sessionClient) {
        return false;
    }
    const parsedSessionClient = JSON.parse(sessionClient);
    return parsedSessionClient;
}
export const logout = () => {
    sessionStorage.removeItem("lens-session");
}