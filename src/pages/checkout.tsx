import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useNewOrderMutation } from "../redux/api/orderAPI";
import { resetCart } from "../redux/reducer/cartReducer";
import { RootState } from "../redux/store";
import { NewOrderRequest } from "../types/api-types";
import { responseToast } from "../utils/features";

const CheckoutForm = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const {
    shippingInfo,
    cartItems,
    subtotal,
    tax,
    discount,
    shippingCharges,
    total,
  } = useSelector((state: RootState) => state.cartReducer);
  const [newOrder] = useNewOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setIsProcessing(true);
    const orderData: NewOrderRequest = {
      shippingInfo,
      orderItems: cartItems,
      subtotal,
      tax,
      discount,
      shippingCharges,
      total,
      user: user?._id!,
    };
    const { paymentIntent, error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin },
      redirect: "if_required",
    });

    if (error) {
      setIsProcessing(false);
      return toast.error(error.message || "Something went wrong");
    }
    if (paymentIntent.status === "succeeded") {
      const res = await newOrder(orderData);
      dispatch(resetCart());
      responseToast(res, navigate, "/orders");
      navigate("/orders");
    }
    setIsProcessing(false);
  };

  return (
    <div className="checkout-container">
      <form onSubmit={submitHandler}>
        <PaymentElement />
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);
const Checkout = () => {
  const location = useLocation();
  const clientSecret: string | undefined = location.state;
  if (!clientSecret) {
    return <Navigate to="/shipping" />;
  }
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
