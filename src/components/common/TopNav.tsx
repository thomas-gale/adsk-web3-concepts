/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { config } from "../../env/config";
import { Identity } from "./Identity";
import { Session } from "../../types/web3/Session";
import { Button } from "../elements/Button";

export interface TopNavProps {
  session: Session | undefined;
}

export const TopNav = ({ session }: TopNavProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className="flex-shrink z-50 w-full pointer-events-none">
      <div
        className="p-4 bg-black flex flex-row items-center shadow-md rounded-xl"
        style={{ justifyContent: "space-between" }}
      >
        <img src={config.icon} alt="Autodesk Logo" width={140} height={60} />
        <div className="flex flex-row">
          <h1 className="text-mmcBlue text-xl font-bold p-4">
            {config.appName}
          </h1>
          <Button onClick={async () => router.push(config.github)}>
            Github
          </Button>
          <Identity session={session} />
        </div>
      </div>
    </div>
  );
};
