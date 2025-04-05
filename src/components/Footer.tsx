
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-medium mb-4">ShopSmart</h3>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for all your shopping needs with the best deals and quality products.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="text-muted-foreground hover:text-foreground transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/featured" className="text-muted-foreground hover:text-foreground transition-colors">
                  Featured Products
                </Link>
              </li>
              <li>
                <Link to="/sale" className="text-muted-foreground hover:text-foreground transition-colors">
                  Sale
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-muted-foreground hover:text-foreground transition-colors">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-foreground transition-colors">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-muted-foreground hover:text-foreground transition-colors">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 text-center text-sm text-muted-foreground">
          <p>© 2025 ShopSmart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
