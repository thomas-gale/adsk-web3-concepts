import React from "react";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { Viewport } from "../editablethree/Viewport";

export const ReactThreeEditableIPFS = (): JSX.Element => {
  const { connector } = useWeb3React<Web3Provider>();

  if (connector) {
    return <Viewport />;
  } else {
    return (
      <div className="m-4 p-4 font-bold">⚠️ Please link with metamask</div>
    );
  }
};
