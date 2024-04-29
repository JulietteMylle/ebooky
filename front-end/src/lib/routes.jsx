import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import DeleteProfile from "../pages/DeleteProfile";
import ErrorPage from "../pages/ErrorPage";
import TermsOfService from "../pages/TermsOfService";
import MyLibrary from "../pages/MyLibrary";
import Library from "../pages/Library";
import NewEbooks from "../components/organisms/NewBooks";

import EbookDetails from "../pages/EbooksDetails";
import Cart from "../pages/Cart";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/deleteProfile" element={<DeleteProfile />} />
      <Route path="/errorPage" element={<ErrorPage />} />

      <Route path="/termsOfService" element={<TermsOfService />} />
      <Route path="/library" element={<Library />} />
      <Route path="/newEbooks" element={<NewEbooks />} />
      <Route path="/ebooks/:id" element={<EbookDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/mylibrary" element={<MyLibrary />} />
    </Routes>
  );
}

export default AppRoutes;
