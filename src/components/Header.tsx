
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Heart, Search, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

const Header = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery)}`);
      toast.success(`Searching for "${searchQuery}"`);
    } else {
      toast.error("Please enter a search term");
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block text-xl">ShopSmart</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
              Products
            </Link>
            <Link to="/categories" className="text-sm font-medium transition-colors hover:text-primary">
              Categories
            </Link>
            {user && (
              <Link to="/orders" className="text-sm font-medium transition-colors hover:text-primary">
                Orders
              </Link>
            )}
          </nav>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center w-1/3">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button type="submit" variant="ghost" size="sm" className="ml-2">
            Search
          </Button>
        </form>

        {/* Nav Icons */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/wishlist" className="relative">
                <Heart className="h-6 w-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="font-medium">
                    {user.username}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button asChild variant="default">
              <Link to="/login">Login</Link>
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-6 py-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm">Navigation</h4>
                  <nav className="grid gap-3">
                    <SheetClose asChild>
                      <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/products" className="text-sm font-medium transition-colors hover:text-primary">
                        Products
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link to="/categories" className="text-sm font-medium transition-colors hover:text-primary">
                        Categories
                      </Link>
                    </SheetClose>
                    {user && (
                      <SheetClose asChild>
                        <Link to="/orders" className="text-sm font-medium transition-colors hover:text-primary">
                          Orders
                        </Link>
                      </SheetClose>
                    )}
                  </nav>
                </div>
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex items-center">
                  <div className="relative w-full">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search products..."
                      className="w-full pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="ghost" size="sm" className="ml-2">
                    Search
                  </Button>
                </form>
                
                {/* Mobile Account Actions */}
                {user ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Account</h4>
                    <div className="grid gap-3">
                      <SheetClose asChild>
                        <Link to="/profile" className="text-sm font-medium transition-colors hover:text-primary">
                          Profile
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/wishlist" className="text-sm font-medium transition-colors hover:text-primary">
                          Wishlist
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link to="/cart" className="text-sm font-medium transition-colors hover:text-primary">
                          Cart
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start" 
                          onClick={handleLogout}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </SheetClose>
                    </div>
                  </div>
                ) : (
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link to="/login">Login</Link>
                    </Button>
                  </SheetClose>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
