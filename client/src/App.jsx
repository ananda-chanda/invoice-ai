import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Upload from './pages/Upload';
import Review from './pages/Review';
import Done from './pages/Done';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Upload />} />
        <Route path="/review/:id" element={<Review />} />
        <Route path="/done/:id" element={<Done />} />
      </Routes>
    </BrowserRouter>
  );
}
