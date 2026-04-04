import AppRouter from "./routes/AppRouter"
import { AuthProvider } from "./context/authContext";

function App() {
  return (
     <AuthProvider>
      <AppRouter />
    </AuthProvider>

  );
 
}

export default App