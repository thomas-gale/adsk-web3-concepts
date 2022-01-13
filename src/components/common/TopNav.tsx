import React from "react";
import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";
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
          <IconButton color="inherit" aria-label="github" href={config.github}>
            <GitHub />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {config.appName}
          </Typography>
          <Identity session={session} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
