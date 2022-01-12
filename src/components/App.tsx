import { Box } from "@mui/material";
import React, { useState } from "react";
import { Session } from "../types/web3/Session";
import { TopNav } from "./common/TopNav";
import { Dashboard } from "./web3/Dashboard";

export const App = (): JSX.Element => {
  const [session] = useState<Session | undefined>({
    userPubKey: "0x000000042",
  });

  return (
    <Box
      style={{
        margin: 0,
        height: "100vh",
        display: "grid",
        gridTemplateRows: "auto 1fr",
      }}
    >
      <TopNav session={session} />
      {session && <Dashboard />}
    </Box>
  );
};
