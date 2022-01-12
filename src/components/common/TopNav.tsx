import React from "react";
import Image from "next/image";
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
    <Box component="div">
      <AppBar position="static">
        <Toolbar>
          <Image
            alt="Autodesk Icon"
            src={config.icon}
            height={16}
            width={180}
          />
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            {config.appName}
          </Typography>
          <Identity session={session} />
        </Toolbar>
      </AppBar>
    </Box>
  );
};
