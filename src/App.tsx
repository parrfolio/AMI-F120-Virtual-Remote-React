import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthListener } from '@/hooks/useAuthListener';
import { useAuthStore } from '@/stores/authStore';
import { Loading } from '@/components/Loading';
import { Login } from '@/components/Login';
import { Songs } from '@/components/Songs';
import { Lights } from '@/components/Lights';
import { About } from '@/components/About';

function App() {
  useAuthListener();
  const { authed, loading } = useAuthStore();

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Jukebox Controller - AMi F-120</title>
        <meta name="viewport" content="user-scalable=no,initial-scale=1.0,maximum-scale=1.0" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Helmet>

      <Routes>
        <Route 
          path="/" 
          element={authed ? <Navigate to="/songs" replace /> : <Login />} 
        />
        <Route 
          path="/songs" 
          element={authed ? <Songs /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/lights" 
          element={authed ? <Lights /> : <Navigate to="/" replace />} 
        />
        <Route 
          path="/about" 
          element={authed ? <About /> : <Navigate to="/" replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
