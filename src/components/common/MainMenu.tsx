import {
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React from "react";
import { Settings } from "@mui/icons-material";

export interface MainMenuProps {
  open: boolean;
  onClose: () => void;
}

export const MainMenu = (props: MainMenuProps): JSX.Element => {
  const { open, onClose } = props;

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <div style={{ width: 250 }}>
        <List>
          <ListItem key={"setting-title"}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={"some setting 1"} />
          </ListItem>
        </List>
        <Divider />
      </div>
    </Drawer>
  );
};
