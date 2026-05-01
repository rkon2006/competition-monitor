import { type ComponentType } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppListPage } from './pages/AppListPage/AppListPage';
import { AppDetailsPage } from './pages/AppDetailsPage/AppDetailsPage';
import { QueryAwareErrorBoundary } from './shared/components/QueryAwareErrorBoundary';

import './App.css';

function page(Component: ComponentType) {
  return (
    <QueryAwareErrorBoundary>
      <Component />
    </QueryAwareErrorBoundary>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={page(AppListPage)} />
        <Route path="/apps/:id" element={page(AppDetailsPage)} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
