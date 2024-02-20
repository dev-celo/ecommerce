import { AppProvider } from '../context/productsContext';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import DetailsProduct from './pages/DetailsProduct/DetailsProduct';
import './app.css';
import PageLogin from './pages/Login/PageLogin';
import PageRegister from './pages/PageRegister/PageRegister';

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/ecommerce" element={<Home />} />
        <Route path="/ecommerce/login" element={<PageLogin />} />
        <Route path="/ecommerce/register" element={<PageRegister />} />
        <Route path="/ecommerce/product/:typeProduct/:id" element={<DetailsProduct />} />
      </Routes>
    </AppProvider>
  )
}

export default App