import { Route, Routes } from "react-router-dom";
import { PATH } from "../src/utils/path";
import LayoutUser from "./templates/user/LayoutUser";
import Home from "../src/pages/user/Home";
import CreatePost from "../src/pages/user/CreatePost";
import PostDetail from "../src/pages/user/PostDetail";
import Profile from "../src/pages/user/Profile";

import LayoutAdmin from "../src/templates/admin/LayoutAdmin";
import Dashboard from "../src/pages/admin/Dashboard";
import AI from "../src/pages/admin/AI";
import Analytic from "../src/pages/admin/Analytic";
import ManagerPage from "../src/pages/admin/ManagerPage";
import ManagerUser from "../src/pages/admin/ManagerUser";
import ManagerPost from "../src/pages/admin/ManagerPost";
import Media from "../src/pages/admin/Media";
// import Login from "../src/components/Login";

function App() {
  return (
    <Routes>
      <Route path={PATH.USER_LAYOUT} element={<LayoutUser />}>
        <Route index element={<Home />} />
        <Route path={PATH.CREATE_POST} element={<CreatePost />} />
        <Route path={PATH.POST_DETAIL} element={<PostDetail />} />
        <Route path={PATH.PROFILE} element={<Profile />} />
      </Route>
      <Route path={PATH.DASHBOARD} element={<LayoutAdmin />}>
        <Route index element={<Dashboard />} />
        <Route path={PATH.AI} element={<AI />} />
        <Route path={PATH.ANALYTIC} element={<Analytic />} />
        <Route path={PATH.MANAGER_PAGE} element={<ManagerPage />} />
        <Route path={PATH.MANAGER_USER} element={<ManagerUser />} />
        <Route path={PATH.MANAGER_POST} element={<ManagerPost />} />
        <Route path={PATH.MEDIA} element={<Media />} />
      </Route>
    </Routes>
  );
}

export default App;
