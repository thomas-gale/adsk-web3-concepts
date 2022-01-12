import { Box } from "@mui/material";
import React, { useState } from "react";
import { Session } from "../types/web3/Session";
import { TopNav } from "./common/TopNav";
// import { AutodeskSession } from "../types/common/UserSession";
// import { useAppDispatch, useAppSelector } from "../hooks/state/useStore";
// import { setMessage, setSession } from "../state/common/userSessionSlice";
import { Dashboard } from "./web3/Dashboard";

export const App = (): JSX.Element => {
  // const [snackbarOpen, setSnackbarOpen] = useState(false);
  // const dispatch = useAppDispatch();

  const [session] = useState<Session | undefined>({
    userPubKey: "0x000000042",
  });

  // Once session is available, save state to store and trigger message
  // useEffect(() => {
  //   if (session) {
  //     dispatch(setSession(session));
  //     dispatch(
  //       setMessage(`Welcome ${session && session.user && session.user.name}`)
  //     );
  //   }
  // }, [session, dispatch]);

  // Anytime the message updates to a non-null value, reopen the snackbar
  // useEffect(() => {
  //   if (message) setSnackbarOpen(true);
  // }, [message, setSnackbarOpen]);

  // const handleWelcomeClose = (
  //   event: React.SyntheticEvent | React.MouseEvent,
  //   reason?: string
  // ): void => {
  //   if (reason === "clickaway") {
  //     return;
  //   }
  //   setSnackbarOpen(false);
  // };

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
      {/* <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleWelcomeClose}
        message={message}
      /> */}
    </Box>
  );
};
