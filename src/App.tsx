import { Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { ComponentPlaygroundPage } from './pages/ComponentPlaygroundPage';
import { WebsiteBuilderPage } from './pages/WebsiteBuilderPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ComponentPlaygroundPage />} />
        <Route path="tools/website-builder" element={<WebsiteBuilderPage />} />
      </Route>
    </Routes>
  );
}

export default App;
