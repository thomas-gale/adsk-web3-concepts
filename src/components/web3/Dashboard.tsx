import React from "react";
import { Box } from "@mui/material";
import { Viewport } from "./Viewport";

export const Dashboard = (): JSX.Element => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 1, m: 1 }}>
        <p>
          Hello Web3
          <ul>
            <li>loading static gltf resource (done)</li>
            <li>store resource on ipfs (todo)</li>
            <li>download resource from ipfs (todo)</li>
            <li>create (todo)</li>
          </ul>
        </p>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Viewport />
      </Box>
    </Box>
  );
};
