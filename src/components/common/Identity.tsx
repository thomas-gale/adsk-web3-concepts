import React from "react";
import { Session } from "../../types/web3/Session";
import { Button } from "../elements/Button";

export interface IdentityProps {
  session: Session | undefined;
}

// TODO - link with metamask.
export const Identity = ({ session }: IdentityProps): JSX.Element => {
  return (
    <>
      {!session && (
        <Button
          onClick={async (): Promise<void> =>
            console.log("Linking with Metamask wallet...")
          }
        >
          Connect Wallet
        </Button>
      )}
      {session && (
        <Button
          onClick={async (): Promise<void> =>
            console.log("Unlinking with Metamask wallet...")
          }
        >
          Disconnect Wallet
        </Button>
      )}
    </>
  );
};
