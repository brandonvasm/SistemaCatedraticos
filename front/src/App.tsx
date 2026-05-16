import AppRouter from "./routes/AppRouter"
import { AuthProvider } from "./context/AuthContext";
import GlobalToast from "./components/common/Globaltoast";

function App() {
  return (
     <AuthProvider>
      <AppRouter />
      <GlobalToast />
    </AuthProvider>

  );
 
}

export default App