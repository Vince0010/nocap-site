import { Box } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/Homepage';
import KeyCapsPage from './pages/KeyCapsPage';
import SwitchesPage from './pages/SwitchesPage';
import KeyboardPage from './pages/KeyboardPage';
import OthersPage from './pages/OthersPage';
import ComparePage from './pages/ComparePage';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import ResultPage from './pages/ResultPage.jsx';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Keyboards', href: '/keyboard' },
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
        logoText="NO CAP"
        navItems={navItems}
        style={{ position: 'sticky', top: 0, zIndex: 1000 }}
      />
      <Box>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/keyboard" element={<KeyboardPage/>} />
          <Route path="/switches" element={<SwitchesPage />} />
          <Route path="/keycaps" element={<KeyCapsPage />} />
          <Route path="/others" element={<OthersPage />} />
          <Route path="/compare" element={<ComparePage/>} />
          <Route path="/:category/:id" element={<ProductDetailPage />} />
          <Route path="/search" element={<ResultPage />} />
          <Route path="*" element={<div>404 - Page Not Found</div>} />

       
        </Routes>
      </Box>
    </Box>
  );
}

export default App;