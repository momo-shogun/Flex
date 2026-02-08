import { Routes, Route } from 'react-router-dom';
import { Layout } from './pages/Layout';
import { ComponentPlaygroundPage } from './pages/ComponentPlaygroundPage';
import { WebsiteBuilderPage } from './pages/WebsiteBuilderPage';
import { AppLayout } from './components/layouts/AppLayout';
import BuilderPage from './routes/builder';
import ComponentLabPage from './routes/component-lab';
import TemplateStudioPage from './routes/template-studio';
import ExportCenterPage from './routes/export-center';
import LibraryManagerPage from './routes/library-manager';
import DesignAnalyzerPage from './routes/design-analyzer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<ComponentPlaygroundPage />} />
        <Route path="tools/website-builder" element={<WebsiteBuilderPage />} />
      </Route>
      <Route element={<AppLayout />}>
        <Route path="builder" element={<BuilderPage />} />
        <Route path="component-lab" element={<ComponentLabPage />} />
        <Route path="template-studio" element={<TemplateStudioPage />} />
        <Route path="export-center" element={<ExportCenterPage />} />
        <Route path="library-manager" element={<LibraryManagerPage />} />
        <Route path="design-analyzer" element={<DesignAnalyzerPage />} />
      </Route>
    </Routes>
  );
}

export default App;
