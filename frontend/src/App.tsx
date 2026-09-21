import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/home";
import { Jeu } from "./pages/jeu";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/jeu" element={<Jeu />} />
      </Routes>
    </BrowserRouter>
  );
}
