import { useState } from "react";
import {
  FaSearch,
  FaShoppingBag,
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";

interface PropsType {
  user: User | null;
}
const Header = ({ user }: PropsType) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const logOutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      setIsOpen(false);
    } catch (err) {
      toast.error("Sign out failed");
    }
  };
  return (
    <nav className="header">
      <Link to={"/"} onClick={() => setIsOpen(false)}>
        HOME
      </Link>
      <Link to={"/search"} onClick={() => setIsOpen(false)}>
        <FaSearch />
      </Link>
      <Link to={"/cart"} onClick={() => setIsOpen(false)}>
        <FaShoppingBag />
      </Link>
      {user?._id ? (
        <>
          <button onClick={() => setIsOpen((prev) => !prev)}>
            <FaUser />
          </button>
          <dialog open={isOpen}>
            <div>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                  Admin
                </Link>
              )}
              <Link to="/orders" onClick={() => setIsOpen(false)}>
                Orders
              </Link>
              <button>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"} onClick={logOutHandler}>
          <FaSignInAlt />
        </Link>
      )}
    </nav>
  );
};

export default Header;
