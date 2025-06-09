import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Loader from "./components/loader";

import toast, { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { getUser } from "./redux/api/userAPI";
import NotFound from "./pages/not-found";
import { RootState } from "./redux/store";
import { Layout } from "antd";
import Navbar from "./components/navbar";

// Lazy-loaded pages
const Checkout = lazy(() => import("./pages/checkout"));
const Home = lazy(() => import("./pages/home"));
const Cart = lazy(() => import("./pages/cart"));
const Search = lazy(() => import("./pages/search"));
const Shipping = lazy(() => import("./pages/shipping"));
const Login = lazy(() => import("./pages/login"));
const Orders = lazy(() => import("./pages/orders"));
const OrderDetails = lazy(() => import("./pages/order-details"));

// Admin Pages
const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProtectedRoute = lazy(() => import("./components/protectedRoute"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid);
        dispatch(userExist(data.user));
      } else {
        dispatch(userNotExist());
      }
    });
  }, [dispatch]);
  useEffect(() => {
    const visited = sessionStorage.getItem("visited");
    if (!visited) {
      toast.success("First load's slow 🐢🐢, free hosting in action!", {
        duration: 10000,
      });
      sessionStorage.setItem("visited", "true");
    }
  }, []);

  const { user } = useSelector((state: RootState) => state.userReducer);

  //return  loading ? (
  //   <Loader />
  // ) :

  return (
    <Router>
      <Navbar user={user} />
      <Layout style={{ height: "100vh", gap: "2rem" }}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />

            {/* Not Logged In User Routes */}
            <Route
              path="/login"
              element={
                <ProtectedRoute isAuthenticated={!user}>
                  <Login />
                </ProtectedRoute>
              }
            />

            {/* Logged In User Routes */}
            <Route element={<ProtectedRoute isAuthenticated={!!user} />}>
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/pay" element={<Checkout />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
                <ProtectedRoute
                  isAuthenticated={true}
                  adminOnly={true}
                  admin={user?.role === "admin"}
                />
              }>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/product" element={<Products />} />
              <Route path="/admin/customer" element={<Customers />} />
              <Route path="/admin/transaction" element={<Transaction />} />
              {/* Charts */}
              <Route path="/admin/chart/bar" element={<Barcharts />} />
              <Route path="/admin/chart/pie" element={<Piecharts />} />
              <Route path="/admin/chart/line" element={<Linecharts />} />
              {/* Apps */}
              <Route path="/admin/app/coupon" element={<Coupon />} />
              {/* Management */}
              <Route path="/admin/product/new" element={<NewProduct />} />
              <Route
                path="/admin/product/:id"
                element={<ProductManagement />}
              />
              <Route
                path="/admin/transaction/:id"
                element={<TransactionManagement />}
              />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Toaster position="top-center" />
      </Layout>
    </Router>
  );
};

export default App;
