import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from "./components/navbar";
import { useUser } from './middleware/useUser';
import AppRoutes from "./AppRoutes";

function App() {
  const { user } = useUser();
  return (
    <Router>
      <div className="App">
      <Navbar user={user} />
      <AppRoutes user={user} />
      </div>
    </Router>
  );
}

export default App;
