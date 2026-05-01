import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppListPage } from './pages/AppListPage/AppListPage';
import { AppDetailsPage } from './pages/AppDetailsPage/AppDetailsPage';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppListPage />} />
        <Route path="/apps/:id" element={<AppDetailsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
