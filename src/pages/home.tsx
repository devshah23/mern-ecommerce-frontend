import { Col, Divider, Row, Typography } from "antd";
import ProductCard from "../components/product-card";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/cartReducer";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { Content } from "antd/es/layout/layout";

// const Home = () => {
//   const dispatch = useDispatch();
//   const { cartItems } = useSelector(
//     (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
//   );
//   const addToCartHandler = (cartItem: CartItem) => {
//     if (cartItem.stock < 1) return toast.error("Out of Stock");
//     const idx = cartItems.findIndex(
//       (item) => item.productId === cartItem.productId
//     );
//     if (idx === -1) {
//       dispatch(addToCart(cartItem));
//       toast.success("Added to cart");
//     } else {
//       if (cartItems[idx].stock < cartItem.quantity) {
//         toast.error("You can't add more than available stock");
//         return;
//       }
//       dispatch(addToCart(cartItem));
//       toast.success("Quantity Updated in cart");
//     }
//   };
//   const { data, isLoading, isError } = useLatestProductsQuery("");
//   if (isError) toast.error("Cannot fetch products");
//   return (
//     <div className="home">
//       <section></section>
//       <h1>
//         Latest Products
//         <Link to="/search" className="findmore">
//           More
//         </Link>
//       </h1>
//       <main>
//         {isLoading ? (
//           <Skeleton width="80vw" />
//         ) : (
//           data?.products.map((product) => {
//             return (
//               <ProductCard
//                 key={product._id}
//                 productId={product._id}
//                 name={product.name}
//                 photo={product.photo}
//                 stock={product.stock}
//                 price={product.price}
//                 handler={addToCartHandler}
//               />
//             );
//           })
//         )}
//       </main>
//     </div>
//   );
// };

// export default Home;

const { Title } = Typography;
const products = [
  {
    id: "65f0a1b2c3d4e5f678901234",
    name: "Wireless Headphones",
    price: 59,
    stock: 0,
    photo:
      "https://m.media-amazon.com/images/G/31/img17/kitchen/Cookware-megaSN-380x500._V509389810_.jpg",
  },
  {
    id: "65f0a1b2c3d4e5f678901235",
    name: "Rudy's Shampoo",
    price: 99,
    stock: 20,
    photo:
      "https://images.wondershare.com/pixcut/assets/blog/product-images-for-ecommerce-sitse-3.jpg",
  },
  {
    id: "65f0a1b2c3d4e5f678901236",
    name: "Mix Headphones",
    price: 39,
    stock: 20,
    photo:
      "https://cdn-bjpdk.nitrocdn.com/dyjDRTumiVVFLKEpXMADzKdEUUbypNrL/assets/images/optimized/rev-f4048d6/www.visualeducation.com/wp-content/uploads/2020/05/Beats_headphones-2-1558px.jpg",
  },
  {
    id: "65f0a1b2c3d4e5f678901237",
    name: "iPhone 16 e",
    price: 499,
    stock: 20,
    photo:
      "https://www.apple.com/newsroom/images/2025/02/apple-debuts-iphone-16e-a-powerful-new-member-of-the-iphone-16-family/article/Apple-iPhone-16e-front-and-back-250219_inline.jpg.large.jpg",
  },
  {
    id: "65f0a1b2c3d4e5f678901238",
    name: "Gaming Mouse",
    price: 39,
    stock: 20,
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    id: "65f0a1b2c3d4e5f678901239",
    name: "Gaming Mouse",
    price: 39,
    stock: 20,
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    id: "65f0a1b2c3d4e5f67890123a",
    name: "Gaming Mouse",
    price: 39,
    stock: 20,
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
  {
    id: "65f0a1b2c3d4e5f67890123b",
    name: "Gaming Mouse",
    price: 39,
    stock: 20,
    photo:
      "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png",
  },
];

const HomeComponent = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );
  const addToCartHandler = (cartItem: CartItem) => {
    if (cartItem.stock < 1) return toast.error("Out of Stock");
    const idx = cartItems.findIndex(
      (item) => item.productId === cartItem.productId
    );
    if (idx === -1) {
      dispatch(addToCart(cartItem));
      toast.success("Added to cart");
    } else {
      if (cartItems[idx].stock < cartItem.quantity) {
        toast.error("You can't add more than available stock");
        return;
      }
      dispatch(addToCart(cartItem));
      toast.success("Quantity Updated in cart");
    }
  };
  const { data, isLoading, isError } = useLatestProductsQuery("");
  if (isError) toast.error("Cannot fetch products");
  return (
    <>
      <Content
        style={{
          width: "87%",
          marginInline: "auto",
          height: "fit-content",
          paddingTop: "80px",
        }}>
        <Title level={4} style={{ marginBlock: "12px" }}>
          Latest Products
        </Title>
        <Divider
          style={{
            marginBottom: "24px",
            marginTop: "0px",
          }}
        />
        <Row
          gutter={[
            { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
            { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
          ]}>
          {products.slice(0, 5).map((product) => (
            <Col key={product.id} xs={12} sm={8} md={6} lg={6} xl={4}>
              <ProductCard
                name={product.name}
                price={product.price}
                photo={product.photo}
                productId={product.id.toString()}
                handler={addToCartHandler}
                stock={product.stock}
              />
            </Col>
          ))}
        </Row>
        <Title level={4} style={{ marginBlock: "12px" }}>
          Most Popular
        </Title>
        <Divider
          style={{
            marginBottom: "24px",
            marginTop: "0px",
          }}
        />
        <Row
          gutter={[
            { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
            { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
          ]}>
          {products.slice(5).map((product) => (
            <Col key={product.id} xs={12} sm={8} md={6} lg={6} xl={4}>
              <ProductCard
                name={product.name}
                price={product.price}
                photo={product.photo}
                productId={product.id.toString()}
                handler={addToCartHandler}
                stock={product.stock}
              />
            </Col>
          ))}
        </Row>
      </Content>
    </>
  );
};

export default HomeComponent;
