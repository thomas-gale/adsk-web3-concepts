import React from "react";

import { Session } from "../../types/web3/Session";
import { Button } from "./Button";

export interface IdentityProps {
  session: Session | undefined;
  setSession: (session: Session | undefined) => void;
}

export const Identity = ({ session }: IdentityProps): JSX.Element => {
  // Hooks to talk with metamask

  return (
    <div className="m-2 flex flex-row items-center">
      {!session && (
        <Button
          mode="dark"
          className="mx-2"
          onClick={async (): Promise<void> =>
            console.log("Linking with Metamask wallet...")
          }
        >
          Connect Wallet
        </Button>
      )}
      {session && (
        <Button
          mode="dark"
          className="mx-2 "
          onClick={async (): Promise<void> =>
            console.log("Unlinking with Metamask wallet...")
          }
        >
          Disconnect Wallet
        </Button>
      )}
    </div>
  );
};
