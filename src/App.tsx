import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Nav from "@/components/Layout/Nav";
import Home from "@/pages/Home";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col justify-center min-h-screen ">
          <Nav />
          <main className="container flex justify-center items-center flex-1 mx-auto px-4 mb-20">
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/projects" element={<Projects />}></Route>
              <Route path="/contact" element={<Contact />}></Route>
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
