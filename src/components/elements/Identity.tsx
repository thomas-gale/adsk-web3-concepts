import React, { useEffect } from "react";
import { Session } from "../../types/web3/Session";
import { Button } from "./Button";

import {
  Web3ReactProvider,
  useWeb3React,
  UnsupportedChainIdError,
} from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";

// Metamask
export const injected = new InjectedConnector({ supportedChainIds: [1, 5] });

// import { initializeConnector } from "@web3-react/core";
// import type { Web3ReactHooks } from "@web3-react/core";
// import type { Connector } from "@web3-react/types";
// import { Network } from "@web3-react/network";
// import { MetaMask } from "@web3-react/metamask";

// // web3 metamask connector
// export const [metaMask, mmHooks, mmStore] = initializeConnector<MetaMask>(
//   (actions) => new MetaMask(actions)
// );

export interface IdentityProps {
  session: Session | undefined;
  setSession: (session: Session | undefined) => void;
}

export const Identity = (_: IdentityProps): JSX.Element => {
  // Hooks to talk with metamask

  // Network
  // const nChainId = nHooks.useChainId();
  // const nAccounts = nHooks.useAccounts();
  // const nError = nHooks.useError();
  // const nError = false;
  // const nConnected = false;
  // const nConnected = Boolean(nChainId && nAccounts);

  const { connector, error, activate } = useWeb3React<Web3Provider>();

  // useEffect(() => {
  //   console.log(context);
  // });

  // MetaMask

  return (
    <div className="m-2 flex flex-row items-center">
      <div>
        {error ? (
          <>🛑 Error</>
        ) : connector ? (
          <>✅ Connected</>
        ) : (
          <>⚠️ Disconnected</>
        )}
      </div>
      {!connector && (
        <Button
          mode="dark"
          className="mx-2"
          onClick={async (): Promise<void> => {
            console.log("Linking with Metamask wallet...");
            activate(injected);
          }}
        >
          Link with Metamask
        </Button>
      )}
      {connector && (
        <Button
          mode="dark"
          className="mx-2"
          onClick={async (): Promise<void> => {
            console.log("Unlinking with Metamask wallet...");
          }}
        >
          Unlink with Metamask
        </Button>
      )}
    </div>
  );
};
