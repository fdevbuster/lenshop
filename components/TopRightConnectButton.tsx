"use client";

import { ConnectKitButton } from "connectkit";
import React from "react";

export function TopRightConnectButton() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ConnectKitButton />
    </div>
  );
}
