import { CartItem } from "../types/types";
import { useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { Badge, Card, Flex, Rate, Typography } from "antd";
import { Button, Image } from "antd";
import { useEffect, useState } from "react";
import { Grid } from "antd";
import { FiShoppingCart } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
// const server = import.meta.env.VITE_SERVER;
const { Meta } = Card;
const { Title, Text } = Typography;
type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => void;
};
type DescriptionProps = {
  price: number;
  handler: () => void;
};

const generateDiscountedPrice = (realPrice: number) => {
  const discountPercentage = Math.floor(Math.random() * (20 - 10 + 1)) + 10;
  const strikeThroughPrice = Math.round(
    realPrice / (1 - discountPercentage / 100)
  );
  return {
    realPrice,
    strikeThroughPrice,
    discountPercentage,
  };
};

const getRandomRating = (): number => {
  return +(Math.random() * (5 - 3.5) + 3.5).toFixed(1);
};

const { useBreakpoint } = Grid;

const PriceComponent = ({ price }: { price: number }) => {
  const screens = useBreakpoint();
  const [priceObject] = useState(generateDiscountedPrice(price));
  return (
    <>
      <Flex gap="small" align="center" wrap="wrap">
        <Text
          delete
          strong
          type="secondary"
          style={{
            fontSize: screens.xs ? "0.9rem" : "1.1em",
          }}>
          ${priceObject.strikeThroughPrice}
        </Text>
        <Text
          type="secondary"
          style={{
            backgroundColor: "rgba(173, 216, 230, 0.3)",
            padding: "0em 0.5em",
            fontSize: screens.xs ? "0.55rem" : "0.6rem",
            borderRadius: "0.25em",
            fontWeight: "500",
            display: "inline-block",
            alignSelf: "center",
          }}>
          -{priceObject.discountPercentage}%
        </Text>
      </Flex>
      <Title
        level={5}
        style={{ margin: "0px", fontSize: screens.xs ? "1rem" : "1.2rem" }}>
        ${priceObject.realPrice}
      </Title>
    </>
  );
};

const DescriptionComponent = ({ price, handler }: DescriptionProps) => {
  const screens = useBreakpoint();

  return (
    <Flex
      justify="space-between"
      wrap="wrap"
      style={{
        gap: screens.xs ? "8px" : "16px",
        flexDirection: screens.xs ? "column" : "row",
        alignItems: screens.xs ? "flex-start" : "center",
      }}>
      <Flex vertical gap={4}>
        <PriceComponent price={price} />
      </Flex>
      <ButtonComponent handler={handler} />
    </Flex>
  );
};

const ButtonComponent = ({ handler }: { handler: () => void }) => {
  const screens = useBreakpoint();
  return (
    <Button
      onClick={() => {
        handler();
      }}
      type="primary"
      icon={<FiShoppingCart size={screens.xs ? 16 : 18} />}
      aria-label="Add to Cart"
      style={{
        padding: screens.xs ? "0.8em 1em" : "1.2em 1.4em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: screens.xs ? "40px" : "auto",
        width: screens.xs ? "100%" : "",
      }}>
      {screens.xs && "Buy"}
    </Button>
  );
};
const TitleComponent = ({ title }: { title: string }) => {
  const screens = useBreakpoint();
  const [ratingValue, setRatingValue] = useState<number>(0);
  useEffect(() => {
    setRatingValue(getRandomRating());
  }, []);

  return (
    <>
      <Title
        level={5}
        ellipsis={{ rows: 2, expandable: true }}
        style={{ margin: "0px", fontSize: screens.xs ? "1rem" : "1.2rem" }}>
        {title}
      </Title>
      <Rate
        value={ratingValue}
        allowHalf
        disabled
        character={<FaStar />}
        style={{
          fontSize: screens.xs ? "0.7rem" : "0.8rem",
          color: "#001861",
        }}
      />
    </>
  );
};

const ProductCard = ({
  productId,
  price,
  name,
  handler,
  photo,
  stock,
}: ProductsProps) => {
  const [loading] = useState(false);

  const { cartItems } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );
  return (
    <Badge.Ribbon
      text="Out of Stock"
      color="red"
      style={{
        display: stock === 0 ? "block" : "none",
      }}>
      <Card
        hoverable
        loading={loading}
        style={{
          height: "100%",
          width: "100%",
          maxWidth: "200px",
          cursor: "default",
        }}
        cover={
          <Image
            alt={name}
            src={`${photo}`}
            preview={false}
            style={{
              height: "200px",
              objectFit: "cover",
              zIndex: 0,
              position: "relative",
            }}
            loading="lazy"
          />
        }>
        <Meta
          title={<TitleComponent title={name} />}
          description={
            <DescriptionComponent
              price={price}
              handler={() => {
                const idx = cartItems.findIndex(
                  (i) => i.productId === productId
                );
                if (idx !== -1)
                  return handler({
                    productId,
                    price,
                    name,
                    stock,
                    photo,
                    quantity: cartItems[idx].quantity + 1,
                  });
                handler({ productId, price, name, stock, photo, quantity: 1 });
              }}
            />
          }
        />
      </Card>
    </Badge.Ribbon>
  );
};

export default ProductCard;
