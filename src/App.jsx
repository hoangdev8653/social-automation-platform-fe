import { Route, Routes } from "react-router-dom";
import { PATH } from "../src/utils/path";
import LayoutUser from "./templates/user/LayoutUser";
import Home from "../src/pages/user/Home";
import CreatePost from "../src/pages/user/CreatePost";
import Profile from "../src/pages/user/Profile";
import AIUser from "../src/pages/user/AI";
import TemplateUser from "../src/pages/user/Template";

import LayoutAdmin from "../src/templates/admin/LayoutAdmin";
import Dashboard from "../src/pages/admin/Dashboard";
import AIAdmin from "../src/pages/admin/AI";
import Analytic from "../src/pages/admin/Analytic";
import Page from "./pages/admin/page/Page";
import User from "./pages/admin/user/User";
import Post from "./pages/admin/post/Post";
import Media from "../src/pages/admin/Media";
import TemplateAdmin from "../src/pages/admin/Template";
import Login from "./pages/Login";

import ProtectedRoute from "../src/templates/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      {/* Public route */}
      <Route path={PATH.LOGIN} element={<Login />} />

      {/* USER layout */}
      <Route
        path={PATH.USER_LAYOUT}
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <LayoutUser />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path={PATH.CREATE_POST} element={<CreatePost />} />
        <Route path={PATH.PROFILE} element={<Profile />} />
        <Route path={PATH.AI_USER} element={<AIUser />} />
        <Route path={PATH.TEMPLATE_USER} element={<TemplateUser />} />
      </Route>

      {/* ADMIN layout */}
      <Route
        path={PATH.DASHBOARD}
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <LayoutAdmin />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path={PATH.AI_ADMIN} element={<AIAdmin />} />
        <Route path={PATH.ANALYTIC} element={<Analytic />} />
        <Route path={PATH.PAGE} element={<Page />} />
        <Route path={PATH.USER} element={<User />} />
        <Route path={PATH.POST} element={<Post />} />
        <Route path={PATH.MEDIA} element={<Media />} />
        <Route path={PATH.TEMPLATE_ADMIN} element={<TemplateAdmin />} />
      </Route>
      {/* 
      Nếu không có quyền
      <Route path="/unauthorized" element={<h1>Không có quyền truy cập</h1>} /> */}
    </Routes>
  );
}

export default App;
