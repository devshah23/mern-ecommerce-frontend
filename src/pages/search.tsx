import { useState } from "react";
import ProductCard from "../components/product-card";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { CartReducerInitialState } from "../types/reducer-types";
import { useDispatch, useSelector } from "react-redux";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import {
  Card,
  Col,
  Divider,
  Flex,
  Grid,
  Input,
  Row,
  Select,
  Space,
  Typography,
} from "antd";

const { useBreakpoint } = Grid;
const { Title } = Typography;

const Search = () => {
  const screens = useBreakpoint();
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  const [search] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [category, setCategory] = useState("");
  const [page] = useState(1);
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
  // const _isPrevPage = page > 1;
  // const _isNextPage = page < 4;
  const {
    data: searchedData,
    // isLoading: _productLoading,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({ search, sort, price: maxPrice, category, page });
  if (isError) toast.error((error as CustomError).data.message);
  if (productIsError) toast.error((productError as CustomError).data.message);

  return (
    <>
      <Flex
        gap="middle"
        style={{
          flexDirection: screens.md ? "row" : "column",
          height: "100%",
          paddingTop: "80px",
        }}>
        <Flex vertical style={{ minWidth: screens.sm ? "21%" : "" }}>
          <Card
            style={{
              textAlign: "center",
              height: screens.sm ? "100%" : "",
            }}>
            <Title level={2}>Search Products</Title>
            <Divider />
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}>
                <Title level={5}>Sort</Title>
                <Select
                  value={sort}
                  onChange={(e) => setSort(e)}
                  style={{ width: "100%" }}>
                  <Select.Option value="">None</Select.Option>
                  <Select.Option value="asc">Price (Low to High)</Select.Option>
                  <Select.Option value="dsc">Price (High to Low)</Select.Option>
                </Select>
              </Space>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}>
                <Title level={5}>Max Price($): {maxPrice}</Title>
                <Input
                  type="range"
                  value={maxPrice}
                  min={5}
                  max={1200}
                  style={{ width: "100%" }}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </Space>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}>
                <Title level={5}>Category</Title>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e)}
                  style={{ width: "100%" }}>
                  <Select.Option value="">All</Select.Option>
                  {!loadingCategories &&
                    categoriesResponse?.categories.map((cat, i) => (
                      <Select.Option key={i} value={cat}>
                        {cat.toUpperCase()}
                      </Select.Option>
                    ))}
                </Select>
              </Space>
            </Space>
          </Card>
        </Flex>
        <Flex flex={1} gap={"middle"} wrap={"wrap"} style={{ minWidth: "" }}>
          <Row
            style={{ width: "100%" }}
            wrap={true}
            gutter={[
              { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
              { xs: 8, sm: 12, md: 16, lg: 18, xl: 18 },
            ]}>
            {searchedData?.products.map((i) => (
              <Col key={i._id} xs={12} sm={9} md={8} lg={6} xl={4}>
                <ProductCard
                  key={i._id}
                  // key={i.id}
                  productId={i._id}
                  // productId={i.id}
                  price={i.price}
                  name={i.name}
                  stock={i.stock}
                  handler={addToCartHandler}
                  photo={i.photo}
                />
              </Col>
            ))}
          </Row>
        </Flex>
      </Flex>
    </>
  );
};

export default Search;
