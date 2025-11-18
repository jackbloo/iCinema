import App from "./App";
import { SnackbarProvider } from "./Snackbar";

function Root() {
  return (
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  );
}

export default Root;