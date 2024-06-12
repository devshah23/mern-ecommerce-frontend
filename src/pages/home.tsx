import { Link } from "react-router-dom";
import ProductCard from "../components/product-card";
import { useLatestProductsQuery } from "../redux/api/productAPI";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import { CartItem } from "../types/types";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/reducer/cartReducer";
import { CartReducerInitialState } from "../types/reducer-types";

const Home = () => {
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
    <div className="home">
      <section></section>
      <h1>
        Latest Products
        <Link to="/search" className="findmore">
          More
        </Link>
      </h1>
      <main>
        {isLoading ? (
          <Skeleton width="80vw" />
        ) : (
          data?.products.map((product) => {
            return (
              <ProductCard
                key={product._id}
                productId={product._id}
                name={product.name}
                photo={product.photo}
                stock={product.stock}
                price={product.price}
                handler={addToCartHandler}
              />
            );
          })
        )}
      </main>
    </div>
  );
};

export default Home;
