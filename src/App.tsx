import { LoginPage } from './components/auth/LoginPage';
import { AppShell } from './components/layout/AppShell';
import { useAppStore } from './store/useAppStore';

function App() {
  const isAuthenticated = useAppStore((state) => state.isAuthenticated);

  return isAuthenticated ? <AppShell /> : <LoginPage />;
}

export default App;
