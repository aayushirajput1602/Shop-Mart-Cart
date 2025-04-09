
-- First delete existing products to avoid duplicates
DELETE FROM products;

-- Insert updated products with unique image URLs for each product
INSERT INTO products (name, description, price, category, inventory_count, image_url)
VALUES 
-- Electronics
('Wireless Headphones', 'Premium noise cancelling wireless headphones with 30 hours of battery life', 199.99, 'electronics', 15, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000'),
('Smart Watch', 'Track your fitness and stay connected with this feature-packed smartwatch', 249.99, 'electronics', 10, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000'),
('Premium Laptop', 'Ultra-thin laptop with powerful performance and all-day battery life', 1299.99, 'electronics', 5, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000'),
('Wireless Earbuds', 'Truly wireless earbuds with amazing sound quality and compact charging case', 129.99, 'electronics', 20, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?q=80&w=1000'),
('Smart Speaker', 'Voice-controlled smart speaker with premium sound quality and digital assistant', 89.99, 'electronics', 25, 'https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=1000'),
('Digital Camera', 'High-resolution digital camera for professional photography', 699.99, 'electronics', 8, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000'),
('Gaming Console', 'Next-generation gaming console with 4K capabilities and extensive game library', 499.99, 'electronics', 3, 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?q=80&w=1000'),
('Drone with Camera', 'Remote-controlled drone with HD camera for aerial photography', 299.99, 'electronics', 10, 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?q=80&w=1000'),

-- Clothing
('Slim Fit T-Shirt', 'Comfortable cotton t-shirt with a modern slim fit design', 24.99, 'clothing', 50, 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=1000'),
('Denim Jeans', 'Classic denim jeans with a timeless design and perfect fit', 59.99, 'clothing', 30, 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=1000'),
('Winter Jacket', 'Stay warm with this insulated winter jacket suitable for extreme cold', 149.99, 'clothing', 15, 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?q=80&w=1000'),
('Running Shoes', 'Lightweight and responsive running shoes for maximum performance', 119.99, 'clothing', 25, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000'),
('Leather Jacket', 'Classic leather jacket with timeless design and comfortable fit', 199.99, 'clothing', 12, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000'),
('Designer Sunglasses', 'Stylish designer sunglasses with UV protection', 159.99, 'clothing', 18, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000'),
('Leather Belt', 'Premium leather belt with classic metal buckle', 49.99, 'clothing', 22, 'https://images.unsplash.com/photo-1624944236957-6eb4b6e92997?q=80&w=1000'),
('Wool Sweater', 'Cozy wool sweater perfect for cool weather', 79.99, 'clothing', 16, 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000'),

-- Books
('Bestselling Novel', 'The latest bestselling fiction novel everyone is talking about', 16.99, 'books', 40, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=1000'),
('Cookbook', 'Master the art of cooking with this comprehensive cookbook', 29.99, 'books', 20, 'https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=1000'),
('Classic Novel Collection', 'Set of 5 classic novels in hardcover edition', 89.99, 'books', 25, 'https://images.unsplash.com/photo-1515098506762-79e1384e9d8e?q=80&w=1000'),
('Self-Improvement Book', 'Best-selling self-help guide to personal development', 19.99, 'books', 30, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000'),
('Travel Guide', 'Comprehensive travel guide with tips and hidden gems', 24.99, 'books', 15, 'https://images.unsplash.com/photo-1583396798356-990189e63012?q=80&w=1000'),

-- Home & Kitchen
('Coffee Maker', 'Premium coffee maker that brews the perfect cup every time', 89.99, 'home', 12, 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1000'),
('Blender', 'High-powered blender for smoothies, soups, and more', 69.99, 'home', 18, 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?q=80&w=1000'),
('Scented Candle Set', 'Set of 3 luxury scented candles for home atmosphere', 49.99, 'home', 22, 'https://images.unsplash.com/photo-1603006905393-eadade55324f?q=80&w=1000'),
('Smart Refrigerator', 'Modern refrigerator with smart features and energy efficiency', 1499.99, 'home', 4, 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=1000'),
('Gardening Tool Set', 'Complete set of gardening tools for home gardening', 79.99, 'home', 17, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000'),
('Kitchen Knife Set', 'Professional-grade kitchen knife set with wooden block', 129.99, 'home', 8, 'https://images.unsplash.com/photo-1593618998160-c8f9530adff9?q=80&w=1000'),
('Ceramic Dinner Set', 'Elegant ceramic dinner set with 16 pieces', 89.99, 'home', 10, 'https://images.unsplash.com/photo-1603199866123-047aca5eccc6?q=80&w=1000'),
('Luxury Bedding Set', 'Premium cotton bedding set with duvet cover and pillowcases', 149.99, 'home', 12, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=1000'),

-- Beauty
('Skincare Set', 'Complete skincare routine with cleanser, toner, and moisturizer', 79.99, 'beauty', 22, 'https://images.unsplash.com/photo-1556228578-5f25e8c9958b?q=80&w=1000'),
('Perfume', 'Elegant fragrance with notes of jasmine and sandalwood', 119.99, 'beauty', 15, 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1000'),
('Makeup Palette', 'Versatile makeup palette with everyday colors for any look', 49.99, 'beauty', 30, 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=1000'),
('Professional Hair Dryer', 'Salon-quality hair dryer with multiple heat and speed settings', 129.99, 'beauty', 14, 'https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=1000'),
('Luxury Bath Set', 'Premium bath bombs, soaps, and oils for a spa experience at home', 59.99, 'beauty', 20, 'https://images.unsplash.com/photo-1570194065650-d99fb4de8b51?q=80&w=1000'),
('Facial Mask Collection', 'Set of 10 premium facial masks for different skin concerns', 29.99, 'beauty', 25, 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1000'),
('Hair Care Bundle', 'Complete hair care system with shampoo, conditioner and treatments', 69.99, 'beauty', 18, 'https://images.unsplash.com/photo-1626015449568-bad337427e5a?q=80&w=1000'),

-- Sports
('Yoga Mat', 'High-quality non-slip yoga mat for comfortable practice', 39.99, 'sports', 30, 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1000'),
('Mountain Bike', 'Durable mountain bike for off-road adventures and trail riding', 599.99, 'sports', 7, 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1000'),
('Tennis Racket', 'Professional-grade tennis racket for improved performance', 149.99, 'sports', 12, 'https://images.unsplash.com/photo-1617165162694-9626d731e4ce?q=80&w=1000'),
('Basketball', 'Official size and weight basketball for indoor and outdoor play', 29.99, 'sports', 20, 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1000'),
('Fitness Tracker', 'Advanced fitness tracker with heart rate monitoring and GPS', 89.99, 'sports', 15, 'https://images.unsplash.com/photo-1575311373937-040b8e97df5a?q=80&w=1000'),

-- Toys & Games
('Board Game Collection', 'Set of classic board games for family fun nights', 69.99, 'toys', 15, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1000'),
('Remote Control Car', 'High-speed remote control car with off-road capabilities', 49.99, 'toys', 18, 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?q=80&w=1000'),
('LEGO Building Set', 'Creative building blocks set for endless imagination', 39.99, 'toys', 22, 'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?q=80&w=1000'),
('Stuffed Animal', 'Soft and cuddly stuffed animal perfect for all ages', 19.99, 'toys', 35, 'https://images.unsplash.com/photo-1539429865482-74134881569d?q=80&w=1000'),
('Puzzle Set', 'Collection of challenging puzzles with different piece counts', 24.99, 'toys', 20, 'https://images.unsplash.com/photo-1559732277-7453b141e3a1?q=80&w=1000');
