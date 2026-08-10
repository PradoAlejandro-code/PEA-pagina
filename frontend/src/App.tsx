import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import PlanesDeEstudio from './pages/PlanesDeEstudio';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* La ruta base renderiza el Home dentro del Layout */}
        <Route index element={<Home />} />
        
        <Route path="estudiantes/planes-de-estudio" element={<PlanesDeEstudio />} />
        
        {/* Fallback para cualquier otra ruta no encontrada (opcional) */}
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}

export default App;
