import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import React, { useMemo } from "react";
import { Session } from "../../types/web3/Session";

export interface IdentityProps {
  session: Session | undefined;
}

// TODO - link with metamask.
export const Identity = (props: IdentityProps): JSX.Element => {
  const { session } = props;
  const [anchorIdentityMenu, setAnchorIdentityMenu] = React.useState<
    undefined | HTMLElement
  >(undefined);
  const showIdentityMenu = useMemo(() => {
    return Boolean(anchorIdentityMenu);
  }, [anchorIdentityMenu]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorIdentityMenu(event.currentTarget);
  };

  const handleMenuClose = (): void => {
    setAnchorIdentityMenu(undefined);
  };

  return (
    <>
      {!session && (
        <Button
          color="inherit"
          onClick={async (): Promise<void> =>
            console.log("Linking with Metamask wallet...")
          }
        >
          Connect Wallet
        </Button>
      )}
      {session && (
        <>
          <IconButton onClick={handleMenuOpen} size="large">
            <Avatar
            // alt={session.user?.name ?? ""}
            // src={session.user?.image ?? ""}
            />
          </IconButton>
          <Menu
            anchorEl={anchorIdentityMenu}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={showIdentityMenu}
            onClose={handleMenuClose}
          >
            <MenuItem>
              <Typography variant="h6">{session.userPubKey}</Typography>
            </MenuItem>
            <MenuItem
              onClick={async (): Promise<void> =>
                console.log("Disconnecting wallet...")
              }
            >
              <Typography variant="button">Disconnect Wallet</Typography>
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );
};
