/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { config } from "../../env/config";
import { Session } from "../../types/web3/Session";
import { Button } from "./Button";

export interface TopNavProps {
  session: Session | undefined;
}

export const TopNav = ({ session }: TopNavProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className="bg-black w-full flex flex-row flex-wrap items-center shadow-md">
      <div className="m-2 flex flex-row items-center">
        <img src={config.icon} alt="Autodesk Logo" width={140} height={60} />
        <h1 className="mx-2 text-light text-xl font-bold p-4">
          {config.appName}
        </h1>
        <Button
          mode="dark"
          className="mx-2"
          onClick={async () => router.push(config.github)}
        >
          Github
        </Button>
      </div>
      <div className="flex-grow" />
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
    </div>
  );
};
