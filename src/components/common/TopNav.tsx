import React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { config } from "../../env/config";
import { Identity } from "./Identity";
import { Session } from "../../types/web3/Session";

export interface TopNavProps {
  session: Session | undefined;
}

export const TopNav = (props: TopNavProps): JSX.Element => {
  const { session } = props;

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt="Autodesk Icon" src={config.icon} height={16} width={180} />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {config.appName}
          </Typography>
          <Identity session={session} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
