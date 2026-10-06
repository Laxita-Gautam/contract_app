import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ReviewAndEdit from "./pages/ReviewAndEdit";
import Summary from "./pages/Summary";



export default function App() {

  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
      <Route
        path="/review"
        element={<ReviewAndEdit />}
      />
      <Route path="/summary" element={<Summary />} />
    </Routes>
  );
}