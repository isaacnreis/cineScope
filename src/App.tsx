import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/index.tsx";
import Favorites from "./pages/Favorites/index.tsx";
import { MovieProvider } from "./context/MovieContext.tsx";
import Header from "./components/Header/index.tsx";
import Footer from "./components/Footer/index.tsx";

function App() {
  return (
    <MovieProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
        <Footer />
      </Router>
    </MovieProvider>
  );
}

export default App;
