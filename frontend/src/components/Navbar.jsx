import React from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
// <-- import image

function Navbar() {
  const user = true;
  const accessToken = localStorage.getItem("accessToken");
  const logoutHandler = async()=>{
    try{
      const res = await axios.post(`http://localhost:8000/api/v1/user/logout`,{},{
        headers:{
          Authorization:`Bearer ${accessToken}`
        }
      });
      if(res.data.success){
        toast.success(res.data.message);
      }
    }
    catch(error){
      console.log(error);
    }
  }
  return (
    <header className="w-full bg-pink-50 fixed z-20 border-b border-pink-200">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-3">
        <div>
          <img src="Ekart.png" alt="Ekart Logo" className="w-[100px]" />
        </div>

        <nav className="flex gap-10 items-center">
          <ul className="flex gap-7 items-center text-xl font-semibold">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/products">Products</Link></li>
            {user && <li><Link to="/profile">Hello User</Link></li>}
          </ul>

          <Link to="/cart" className="relative">
            <ShoppingCart className="w-7 h-7 text-gray-700" />
            <span className="bg-pink-500 rounded-full absolute text-white -top-3 -right-5 px-2 text-sm">
              0
            </span>
          </Link>

          {user ? (
            <Button className="bg-pink-600 text-white">Logout</Button>
          ) : (
            <Button className="bg-gradient-to-tl from-blue-600 to-purple-600 text-white">
              Log In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
