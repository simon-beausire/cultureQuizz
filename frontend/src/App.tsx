import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Accueil } from "./pages/accueil";
import { Categories } from "./pages/categories";
import { Jeu } from "./pages/jeu";
import { Resultat } from "./pages/resultat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Accueil />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/jeu/:categorieId" element={<Jeu />} />
        <Route path="/resultat" element={<Resultat />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
