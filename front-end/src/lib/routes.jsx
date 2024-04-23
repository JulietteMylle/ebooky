import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import DeleteProfile from "../pages/DeleteProfile";
import ErrorPage from "../pages/ErrorPage";
import TermsOfService from "../pages/TermsOfService";
import EbookDetails from "../pages/EbooksDetails";
import Cart from "../pages/Cart";
import AdminProfile from "../pages/AdminProfile";
import AdminDeleteProfile from "../pages/AdminDeleteProfile";
import AdminEbookList from "../pages/AdminEbookList";


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/profile" element={<AdminProfile />} />

      <Route path="/deleteProfile" element={<DeleteProfile />} />
      <Route path="/admin/deleteProfile" element={<AdminDeleteProfile />} />

      <Route path="/errorPage" element={<ErrorPage />} />
      <Route path="/ebooks/:id" element={<EbookDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/admin/ebookListPage" element={<AdminEbookList />} />



      <Route path="/termsOfService" element={<TermsOfService />} />

    </Routes>
  );

}

export default AppRoutes;
