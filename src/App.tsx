import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Location from "./pages/Location";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/Location" element={<Location />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
