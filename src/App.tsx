import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Nav from "@/components/Layout/Nav";
import Home from "@/pages/Home";
import Footer from "@/components/Layout/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-col justify-center bg-cover bg-center min-h-screen ">
          <Nav />
          <main className="container flex justify-center items-center flex-1 mx-auto px-4">
            <Routes>
              <Route path="/" element={<Home />}></Route>
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
