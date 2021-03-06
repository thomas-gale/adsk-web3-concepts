import React from "react";
import { useRouter } from "next/router";
import { Button } from "./elements/Button";

export const Dashboard = (): JSX.Element => {
  const router = useRouter();
  return (
    <div className="m-1 p-1 bg-inherit">
      <div>
        Page deployed on IPFS using <a href="https://fleek.co/">fleek</a>
      </div>
      <div className="flex">
        <Button
          mode="light"
          className="m-2"
          onClick={async (): Promise<boolean> => await router.push("/concept1")}
        >
          Concept 1 - Forge Viewer IPFS
        </Button>
        <Button
          mode="light"
          className="m-2"
          onClick={async (): Promise<boolean> => await router.push("/concept2")}
        >
          Concept 2 - React Three Editable IPFS
        </Button>
      </div>
    </div>
  );
};
