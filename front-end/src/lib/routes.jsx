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
      <Route path="/admin/authorPage" element={<AdminAuthorPage />} />
      <Route path="/admin/addAuthor" element={<AddAuthorForm />} />
      <Route path="/admin/publishers" element={<AdminPublisherPage />} />
      <Route path="/admin/addPublisher" element={<AdminAddPublisher />} />
      <Route path="/admin/addEbook" element={<AddEbookForm />} />
      <Route
        path="/admin/updateEbookCover/:id"
        element={<UpdateEbookCoverComponent />}
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
