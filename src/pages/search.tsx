import { useState } from "react";
import ProductCard from "../components/product-card";
import toast from "react-hot-toast";
import { CustomError } from "../types/api-types";
import {
  useCategoriesQuery,
  useSearchProductsQuery,
} from "../redux/api/productAPI";
import { Skeleton } from "../components/loader";
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
const { Title, Text } = Typography;

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
const Search = () => {
  const screens = useBreakpoint();
  const {
    data: categoriesResponse,
    isLoading: loadingCategories,
    isError,
    error,
  } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
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
  const isPrevPage = page > 1;
  const isNextPage = page < 4;
  const {
    data: searchedData,
    isLoading: productLoading,
    isError: productIsError,
    error: productError,
  } = useSearchProductsQuery({ search, sort, price: maxPrice, category, page });
  if (isError) toast.error((error as CustomError).data.message);
  if (productIsError) toast.error((productError as CustomError).data.message);

  return (
    // <div className="product-search-page">
    //   <aside>
    //     <h2>Filters</h2>
    //     <div>
    //       <h4>Sort</h4>
    //       <select value={sort} onChange={(e) => setSort(e.target.value)}>
    //         <option value="">None</option>
    //         <option value="asc">Price (Low to High)</option>
    //         <option value="dsc">Price (High to Low)</option>
    //       </select>
    //     </div>
    //     <div>
    //       <h4>Max Price:{maxPrice || ""}</h4>
    //       <input
    //         type="range"
    //         value={maxPrice}
    //         min={100}
    //         max={100000}
    //         onChange={(e) => setMaxPrice(Number(e.target.value))}
    //       />
    //     </div>
    //     <div>
    //       <h4>Category</h4>
    //       <select
    //         value={category}
    //         onChange={(e) => setCategory(e.target.value)}>
    //         <option value="">ALL</option>
    //         {!loadingCategories &&
    //           categoriesResponse?.categories.map((cat, i) => (
    //             <option key={i} value={cat}>
    //               {cat.toUpperCase()}
    //             </option>
    //           ))}
    //       </select>
    //     </div>
    //   </aside>
    //   <main>
    //     <h1>Products</h1>
    //     <input
    //       type="text"
    //       placeholder="Search by name..."
    //       value={search}
    //       onChange={(e) => setSearch(e.target.value)}
    //     />
    //     {productLoading ? (
    //       <Skeleton length={10} />
    //     ) : (
    //       <div className="search-product-list">
    //         {searchedData?.products.map((i) => (
    //           <ProductCard
    //             key={i._id}
    //             productId={i._id}
    //             price={i.price}
    //             name={i.name}
    //             stock={i.stock}
    //             handler={addToCartHandler}
    //             photo={i.photo}
    //           />
    //         ))}
    //       </div>
    //     )}
    //     {searchedData && searchedData.totalPage > 1 && (
    //       <article>
    //         <button
    //           disabled={!isPrevPage}
    //           onClick={() => setPage((prev) => prev - 1)}>
    //           Prev
    //         </button>
    //         <span>
    //           {page} of {searchedData.totalPage}
    //         </span>
    //         <button
    //           disabled={!isNextPage}
    //           onClick={() => setPage((prev) => prev + 1)}>
    //           Next
    //         </button>
    //       </article>
    //     )}
    //   </main>
    // </div>
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
