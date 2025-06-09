import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { CartItem as CartItemTypes } from "../types/types";
import { Button, Card, Col, Flex, Grid, Image, Row, Typography } from "antd";
// import { server } from "../redux/store";

const { Title, Text } = Typography;

type CartItemProps = {
  cartItem: CartItemTypes;
  incrementHandler: (cartItem: CartItemTypes) => void;
  decrementHandler: (cartItem: CartItemTypes) => void;

  removeHandler: (id: string) => void;
};

const { useBreakpoint } = Grid;
const CartItem = ({
  cartItem,
  incrementHandler,
  decrementHandler,
  removeHandler,
}: CartItemProps) => {
  const { photo, productId, price, quantity, name } = cartItem;
  const screens = useBreakpoint();
  return (
    <>
      <Card style={{ margin: "1em" }}>
        <Row
          style={{ width: "100%" }}
          gutter={[
            { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
            { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
          ]}>
          <Col
            xs={24}
            sm={24}
            md={8}
            lg={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <Image
              src={photo}
              alt={name}
              preview={false}
              style={{
                width: "100%",
                maxWidth: "200px",
                height: "auto",
                borderRadius: "8px",
                objectFit: "cover",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Col>

          <Col xs={24} md={16} lg={18}>
            <Flex
              justify="space-between"
              align="center"
              style={{
                flexDirection: screens.xs ? "column-reverse" : "row",
                gap: screens.xs ? "12px" : "0px",
              }}>
              <Title level={3} style={{ margin: 0 }}>
                {name}
              </Title>
              <div>
                <Title level={5} type="secondary" style={{ margin: 0 }}>
                  Product Total
                </Title>
                <Title
                  level={3}
                  style={{ margin: 0, textAlign: "center" }}
                  type="secondary">
                  ${price * quantity}
                </Title>
              </div>
            </Flex>

            <Title
              level={4}
              style={{ textAlign: screens.xs ? "center" : undefined }}>
              Price: ${price}
            </Title>
            <Flex
              style={{
                flexDirection: screens.xs ? "column-reverse" : "row",
                gap: screens.xs ? "12px" : "6px",
              }}>
              <Text type="secondary">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Accusantium, nam sunt vel voluptatum ipsa provident commodi
                nulla dignissimos. Quidem, ex a voluptatibus laborum quas ab
                dolor vitae soluta eos ratione?
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems:
                    screens.lg || screens.xl || screens.xxl
                      ? "flex-start"
                      : "center",
                  justifyContent: "center",
                }}>
                <Flex gap="small" vertical>
                  <Flex gap="middle">
                    <Button
                      color="default"
                      variant="outlined"
                      onClick={() => decrementHandler(cartItem)}
                      icon={<FaMinus />}
                      style={{
                        backgroundColor: "#1677ff",
                        color: "#fff",
                        border: "1px solid #1677ff",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        fontWeight: "bold",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#125bcc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1677ff")
                      }
                    />
                    <Title
                      level={4}
                      style={{
                        minWidth: "25px",
                        textAlign: "center",
                        margin: 0,
                      }}>
                      {quantity}
                    </Title>
                    <Button
                      variant="outlined"
                      color="default"
                      onClick={() => incrementHandler(cartItem)}
                      icon={<FaPlus />}
                      style={{
                        backgroundColor: "#1677ff",
                        color: "#fff",
                        border: "1px solid #1677ff",

                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        fontWeight: "bold",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.backgroundColor = "#125bcc")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.backgroundColor = "#1677ff")
                      }
                    />
                  </Flex>
                  <Button
                    variant="outlined"
                    danger
                    onClick={() => removeHandler(productId)}
                    icon={<FaTrash />}>
                    Remove
                  </Button>
                </Flex>
              </div>
            </Flex>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default CartItem;
