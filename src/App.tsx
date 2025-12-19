import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Nav from "./components/Layout/Nav";
import Home from "./pages/Home";
import Footer from "./components/Layout/Footer";

function App() {
  return (
    <Router>
      <Nav />
      <main className="container mx-auto px-4 h-full">
        Da
        <Routes>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
