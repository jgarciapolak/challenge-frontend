import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home/Home";
import Login from "./views/login/Login";

// Creo un Router con dos rutas, cada ruta muestra un componente, el componente para el Home y el componente para el Login

const App = () => {
  return (
    <div style={styles.app}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;

const styles = {
  app: {
    padding: 50,
  },
};