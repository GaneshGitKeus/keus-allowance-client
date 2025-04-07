import './App.css';
import Home from './Components/Home/Home';
import Main from './Components/Main/Main';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="main" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;