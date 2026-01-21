import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Nav from "@/components/Layout/Nav";
import Home from "@/pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import About from "./pages/About";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col justify-center min-h-screen ">
          <Nav />
          <main className="container flex justify-center items-center flex-1 mx-auto px-4 mb-20">
            <ScrollToTop>
              <Routes>
                <Route path="/" element={<Home />}></Route>
                <Route path="/projects" element={<Projects />}></Route>
                <Route path="/about" element={<About />}></Route>
                <Route path="/contact" element={<Contact />}></Route>
              </Routes>
            </ScrollToTop>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
