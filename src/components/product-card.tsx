import { FaPlus } from "react-icons/fa";
import { server } from "../redux/store";
import { CartItem } from "../types/types";
import { useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";

type ProductsProps = {
  productId: string;
  photo: string;
  name: string;
  price: number;
  stock: number;
  handler: (cartItem: CartItem) => string | undefined;
};

const ProductCard = ({
  productId,
  price,
  name,
  stock,
  photo,
  handler,
}: ProductsProps) => {
  const { cartItems } = useSelector(
    (state: { cartReducer: CartReducerInitialState }) => state.cartReducer
  );
  return (
    <div className="product-card">
      <img src={`${server}/${photo}`} alt={name} />
      <p>{name}</p>
      <span>₹{price}</span>
      <div>
        <button
          onClick={() => {
            const idx = cartItems.findIndex((i) => i.productId === productId);
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
          }}>
          <FaPlus />
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
