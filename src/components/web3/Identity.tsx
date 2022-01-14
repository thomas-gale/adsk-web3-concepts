import React from "react";
import { Button } from "../elements/Button";

import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";
import { truncateEthAddress } from "../../helpers/web3/truncateEthAddress";

// Metamask
export const injected = new InjectedConnector({ supportedChainIds: [1, 5] });

export const Identity = (): JSX.Element => {
  const { connector, activate, deactivate, account, error } =
    useWeb3React<Web3Provider>();

  return (
    <div className="m-2 flex flex-row items-center">
      <div className="text-light">
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
          onClick={async (): Promise<void> => activate(injected)}
        >
          Link with Metamask
        </Button>
      )}
      {connector && (
        <Button
          mode="dark"
          className="mx-2"
          onClick={async (): Promise<void> => deactivate()}
        >
          Unlink {truncateEthAddress(account ?? "")}
        </Button>
      )}
    </div>
  );
};
