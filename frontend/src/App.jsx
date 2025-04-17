import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Homepage';
import KeyCapsPage from './pages/KeyCapsPage';
import SwitchesPage from './pages/SwitchesPage';
import KeyboardPage from './pages/KeyboardPage';
import OthersPage from './pages/OthersPage';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Keyboards', href: '/keyboards' },
  { label: 'Switches', href: '/switches' },
  { label: 'Key Caps', href: '/keycaps' },
  { label: 'Others', href: '/others' },
  { label: 'Compare', href: '/compare' },
];

function App() {
  return (
    <Box  h="100vh" // Set the outer container to exactly the viewport height
    overflow="hidden" >
      
      <Navbar
        logoText="No Cap"
        navItems={navItems}
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      />
      <Box>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/keyboards" element={<KeyboardPage/>} />
          <Route path="/switches" element={<SwitchesPage />} />
          <Route path="/keycaps" element={<KeyCapsPage />} />
          <Route path="/others" element={<OthersPage />} />
          <Route path="/compare" element={<div>Compare Page</div>} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;