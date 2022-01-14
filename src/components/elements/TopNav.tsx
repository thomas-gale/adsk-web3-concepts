/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { config } from "../../env/config";
import { Button } from "./Button";
import { Identity } from "../web3/Identity";

export const TopNav = (): JSX.Element => {
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
      <Identity />
    </div>
  );
};
