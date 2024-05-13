import { Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
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
import AdminAuthorPage from "../pages/AdminAuthorPage";
import AddAuthorForm from "../pages/AdminAddAuthor";
import AdminPublisherPage from "../pages/AdminPublishers";
import AdminAddPublisher from "../pages/AdminAddPublisher";
import AddEbookForm from "../pages/AdminAddEbook";
import UpdateEbookCoverComponent from "../pages/AdminUpdateCover";

import PaymentPage from "../pages/PaymentPage";
import ConfirmationPage from "../pages/ConfirmationPage";

import Library from "../pages/Library";
import UserLibrary from "../pages/UserLibrary";

import ResetPasswordForm from "../pages/ResetPasswordRequest";
import ResetPasswordEmail from "../pages/ResetPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";

function AppRoutes() {
  const token = localStorage.getItem("session");
  let decodeToken = null;

  if (token) {
    const parsedTokenObject = JSON.parse(token);
    const tokenValue = parsedTokenObject.token;
    decodeToken = jwtDecode(tokenValue);

  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />


      <Route path="/deleteProfile" element={<DeleteProfile />} />


      <Route path="/errorPage" element={<ErrorPage />} />
      <Route path="/ebooks/:id" element={<EbookDetails />} />
      <Route path="/cart" element={<Cart />} />



      <Route
        path="/admin/deleteProfile"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AdminDeleteProfile />
          ) : (
            <Navigate to="/" />
          )
        }
      />




      <Route
        path="/admin/profile"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AdminProfile />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/ebookListPage"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AdminEbookList />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/authorPage"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AdminAuthorPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/addAuthor"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AddAuthorForm />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/publishers"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AdminPublisherPage />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/addPublisher"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AdminAddPublisher />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/addEbook"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <AddEbookForm />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route
        path="/admin/updateEbookCover/:id"
        element={
          decodeToken && decodeToken.role.includes("ROLE_ADMIN") ? (
            <UpdateEbookCoverComponent />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      <Route path="/cart/pay" element={<PaymentPage />} />
      <Route path="/confirmation" element={<ConfirmationPage />} />

      <Route path="/library" element={<Library />} />
      <Route path="/Userlibrary" element={<UserLibrary />} />

      <Route path="/resetPassword" element={<ResetPasswordForm />} />
      <Route path="/resetPasswordEmail/:token" element={<ResetPasswordPage />} />

      <Route path="/termsOfService" element={<TermsOfService />} />
    </Routes>
  );
}

export default AppRoutes;
