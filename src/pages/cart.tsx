import { useEffect, useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/cart-item";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import toast from "react-hot-toast";
import {
  addToCart,
  calculatePrice,
  discountApplied,
  removeCartItem,
} from "../redux/reducer/cartReducer";
import axios from "axios";
import { RootState, server } from "../redux/store";

import {
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Input,
  Space,
  Typography,
} from "antd";

const { Title, Text } = Typography;
const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems, subtotal, tax, total, shippingCharges, discount } =
    useSelector(
      (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
    );
  const { user } = useSelector((state: RootState) => state.userReducer);
  const incrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) {
      toast.error("You can't add more than available stock");
      return;
    }
    console.log("Called incrementHandler");
    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity + 1 }));
  };
  const decrementHandler = (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) {
      dispatch(removeCartItem(cartItem.productId));
      return;
    }

    dispatch(addToCart({ ...cartItem, quantity: cartItem.quantity - 1 }));
  };
  const removeHandler = (productId: string) => {
    dispatch(removeCartItem(productId));
    toast.success("Removed from cart");
  };
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setisValidCouponCode] = useState<boolean>(false);

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  useEffect(() => {
    const { token: cancelToken, cancel } = axios.CancelToken.source();
    const id = setTimeout(() => {
      axios
        .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`, {
          cancelToken,
        })
        .then((res) => {
          dispatch(discountApplied(res.data.discount));
          setisValidCouponCode(true);
          dispatch(calculatePrice());
        })
        .catch(() => {
          dispatch(discountApplied(0));
          setisValidCouponCode(false);
          dispatch(calculatePrice());
        });
    }, 1000);
    return () => {
      clearTimeout(id);
      cancel();
      setisValidCouponCode(false);
    };
  }, [couponCode]);

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems]);

  return (
    <>
      {/* <Layout
        style={{
          height: "100%",
          display: "flex",
          flexDirection: screens.md ? "row" : "column", // Row on medium & large screens, column on small screens
          gap: "1rem",
          padding: "1rem",
        }}>
        <Content
          style={{
            // width: "70%",
            // marginInline: "auto",

            height: "100%",
            paddingTop: "80px",
          }}>
          <Space
            direction="vertical"
            size="large"
            style={{ width: "100%", height: "100%" }}>
            {cartItems.length > 0 ? (
              cartItems.map((i, idx) => (
                <CartItemCard
                  key={idx}
                  cartItem={i}
                  incrementHandler={incrementHandler}
                  decrementHandler={decrementHandler}
                  removeHandler={removeHandler}
                />
              ))
            ) : (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Title level={3}>No Item in the cart</Title>
              </div>
            )}
          </Space>
        </Content>
        <Sider style={{ height: "100%", paddingTop: "80px" }}>
          <p>Subtotal: ₹{subtotal}</p>
          <p>Shipping Charges: ₹{shippingCharges}</p>
          <p>Tax: ₹{tax}</p>
          <p>
            Discount: <em className="red"> - ₹{discount}</em>
          </p>
          <p>
            <b>Total: ₹{total}</b>
          </p>
          <input
            type="text"
            placeholder="Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          {couponCode &&
            (isValidCouponCode ? (
              <span className="green">
                ₹{discount} off using the <code>{couponCode}</code>
              </span>
            ) : (
              <span className="red">
                Invalid Coupon <VscError />
              </span>
            ))}
          {cartItems.length > 0 && user && <Link to="/shipping">Checkout</Link>}
        </Sider>
      </Layout> */}
      <Flex
        gap="middle"
        style={{
          flexDirection: screens.md ? "row" : "column",
          height: "100%",
          paddingTop: "80px",
        }}>
        <Flex vertical flex={1}>
          {cartItems.length > 0 ? (
            cartItems.map((i, idx) => (
              <CartItemCard
                key={idx}
                cartItem={i}
                incrementHandler={incrementHandler}
                decrementHandler={decrementHandler}
                removeHandler={removeHandler}
              />
            ))
          ) : (
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Title level={3}>No Item in the cart</Title>
            </div>
          )}
        </Flex>
        {cartItems.length > 0 ? (
          <Card
            style={{
              paddingTop: "40px",
              // height: screens.md ? "100" : "",
              height: "fit-content",
              minWidth: screens.lg ? "25%" : "35%",
            }}>
            <Title level={2}>Cart Summary</Title>
            <Divider />
            <Title level={4}>SubTotal</Title>
            <Text strong type="secondary">
              ${subtotal.toFixed(2)}
            </Text>
            <Title level={4}>Shipping Charges</Title>
            <Text strong type="secondary">
              {cartItems.length > 0
                ? `$${shippingCharges.toFixed(2)}`
                : `$0.00`}
            </Text>

            <Title level={4}>Tax</Title>
            <Text strong type="secondary">
              {cartItems.length > 0 ? `$${tax.toFixed(2)}` : `$0.00`}
            </Text>
            <Title level={4}>Discount</Title>
            <Text strong type="secondary">
              {cartItems.length > 0 ? `$${discount.toFixed(2)}` : `$0.00`}
            </Text>

            <Title level={3}>Grand Total</Title>
            <Text strong type="secondary" style={{ fontSize: "1.3rem" }}>
              {cartItems.length > 0 ? `$${total.toFixed(2)}` : `$0.00`}
            </Text>
            <br />
            <Space
              size="large"
              direction="vertical"
              style={{ width: "100%", marginTop: "30px" }}>
              {user && (
                <Flex vertical gap="small">
                  <Text type="secondary" strong>
                    Coupon Code
                  </Text>
                  <Space size={"small"}>
                    <Input
                      type="text"
                      placeholder="Coupon Code"
                      style={{ width: "90%" }}
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      status={
                        couponCode ? (isValidCouponCode ? "" : "error") : ""
                      }
                    />
                    {couponCode &&
                      (isValidCouponCode ? (
                        <Text type="success">
                          ${discount} off using the <code>{couponCode}</code>
                        </Text>
                      ) : (
                        <Text type="danger">
                          Invalid Coupon <VscError />
                        </Text>
                      ))}
                  </Space>
                </Flex>
              )}

              {cartItems.length > 0 && user ? (
                <Button
                  type="primary"
                  onClick={() => {
                    navigate("/shipping");
                  }}
                  style={{
                    marginInline: "auto",
                    display: "block",
                    width: "90%",
                  }}>
                  Checkout
                </Button>
              ) : (
                <Title
                  level={5}
                  type="warning"
                  style={{ textAlign: "center", paddingTop: "40px" }}>
                  Please Login to Checkout
                </Title>
              )}
            </Space>
          </Card>
        ) : (
          ""
        )}
      </Flex>
    </>
  );
};

export default Cart;
