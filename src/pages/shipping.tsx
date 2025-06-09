import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiArrowBack } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../redux/store";
import { CartReducerInitialState } from "../types/reducer-types";
import { saveShippingInfo } from "../redux/reducer/cartReducer";
import {
  Button,
  Card,
  Divider,
  Flex,
  Form,
  Grid,
  Input,
  Select,
  Typography,
} from "antd";
import { Content } from "antd/es/layout/layout";
import { IoHome } from "react-icons/io5";

const Shipping = () => {
  const { useBreakpoint } = Grid;
  const dispatch = useDispatch();
  const { Title } = Typography;
  const screens = useBreakpoint();
  const { cartItems, total } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );
  const submitHandler = async (values: typeof shippingInfo) => {
    dispatch(saveShippingInfo(values));

    try {
      const { data } = await axios.post(
        `${server}/api/v1/payment/create`,
        { amount: total },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const [shippingInfo, setShippingInfo] = useState({
    address: "",
    pinCode: "",
    city: "",
    country: "",
    state: "",
  });
  const changeHandler = (e: { target: { name: string; value: string } }) => {
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const navigate = useNavigate();
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems]);
  return (
    <>
      <Content
        style={{
          width: "87%",
          marginInline: "auto",
          height: "fit-content",
          paddingTop: "80px",
          display: "flex",
          justifyContent: "center",
        }}>
        <Card
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "1rem",
          }}>
          <Title level={screens.xs ? 3 : 1} style={{ textAlign: "center" }}>
            <Flex align="center" gap="middle">
              <Button
                style={{ verticalAlign: "middle" }}
                onClick={() => navigate("/cart")}
                variant="outlined"
                color="default"
                icon={<BiArrowBack />}
              />
              Shipping Address
              <IoHome style={{ fontSize: "2rem" }} />
            </Flex>
          </Title>
          <Divider />
          <Form
            layout="vertical"
            onFinish={submitHandler}
            style={{
              alignSelf: "center",
              maxWidth: "400px",
              margin: "auto",
            }}>
            <Form.Item
              label="Address"
              name="address"
              rules={[{ required: true, message: "Address is required" }]}>
              <Input
                placeholder="Address"
                value={shippingInfo.address}
                onChange={changeHandler}
              />
            </Form.Item>

            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "City is required" }]}>
              <Input
                placeholder="City"
                value={shippingInfo.city}
                onChange={changeHandler}
              />
            </Form.Item>

            <Form.Item
              label="State"
              name="state"
              rules={[{ required: true, message: "State is required" }]}>
              <Input
                placeholder="State"
                value={shippingInfo.state}
                onChange={changeHandler}
              />
            </Form.Item>

            <Form.Item
              label="Pin Code"
              name="pinCode"
              rules={[{ required: true, message: "Pin Code is required" }]}>
              <Input
                type="number"
                placeholder="Pin Code"
                value={shippingInfo.pinCode}
                onChange={changeHandler}
              />
            </Form.Item>

            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: "Country is required" }]}>
              <Select
                placeholder="Choose Country"
                value={shippingInfo.country}
                onChange={(value) =>
                  changeHandler({ target: { name: "country", value } })
                }>
                <Select.Option value="">Choose Country</Select.Option>
                <Select.Option value="india">India</Select.Option>
                <Select.Option value="usa">United States</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" block htmlType="submit">
                Pay Now
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Content>
    </>
  );
};

export default Shipping;
