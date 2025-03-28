import { Col, Divider, Row, Typography } from "antd";
import ProductCard from "../components/product-card";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/cartReducer";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import { Content } from "antd/es/layout/layout";

const { Title } = Typography;

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
  const { data, isError } = useLatestProductsQuery("");
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
          {data?.products.map((product) => (
            <Col key={product._id} xs={12} sm={8} md={6} lg={6} xl={4}>
              <ProductCard
                name={product.name}
                price={product.price}
                photo={product.photo}
                productId={product._id.toString()}
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
          {data?.products.slice(0, 3).map((product) => (
            <Col key={product._id} xs={12} sm={8} md={6} lg={6} xl={4}>
              <ProductCard
                name={product.name}
                price={product.price}
                photo={product.photo}
                productId={product._id.toString()}
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
