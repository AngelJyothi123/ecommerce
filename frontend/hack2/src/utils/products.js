export const SAMPLE_PRODUCTS = [
  { id: 1, name: "MacBook Pro", description: "Powerful laptop for professionals with M3 chip, 16GB RAM, 512GB SSD. Perfect for developers, designers, and creative professionals.", price: 1299.99, imageUrl: "/images/macbook.jpg", category: { id: 1, name: "Electronics" }, stock: 15 },
  { id: 2, name: "iPhone 15", description: "Latest Apple smartphone with A17 chip, 6.1 inch display, 128GB storage. Features advanced camera system.", price: 999.99, imageUrl: "/images/iphone.jpg", category: { id: 1, name: "Electronics" }, stock: 25 },
  { id: 3, name: "Sony Headphones", description: "Premium wireless noise-canceling headphones with 30-hour battery life. Crystal clear audio quality.", price: 349.99, imageUrl: "/images/sony-headphones.jpg", category: { id: 1, name: "Electronics" }, stock: 30 },
  { id: 4, name: "Apple Watch", description: "Smart fitness watch with health monitoring, GPS, and water resistance. Series 9 with always-on display.", price: 399.99, imageUrl: "/images/apple-watch.jpg", category: { id: 1, name: "Electronics" }, stock: 20 },
  { id: 5, name: "Canon Camera", description: "Professional DSLR camera with 24.2MP sensor, 45-point AF system, and 4K video recording.", price: 899.99, imageUrl: "/images/camera.jpg", category: { id: 1, name: "Electronics" }, stock: 10 },
  { id: 6, name: "Nike Running Shoes", description: "Lightweight running shoes with responsive cushioning. Perfect for daily training and races.", price: 129.99, imageUrl: "/images/nike-shoes.jpg", category: { id: 2, name: "Footwear" }, stock: 40 },
  { id: 7, name: "Adidas Sneakers", description: "Sporty sneakers for everyday wear. Comfortable design with excellent arch support.", price: 119.99, imageUrl: "/images/adidas-sneakers.jpg", category: { id: 2, name: "Footwear" }, stock: 35 },
  { id: 8, name: "Designer Shirt", description: "Premium cotton formal shirt with slim fit. Perfect for office and special occasions.", price: 79.99, imageUrl: "/images/designer-shirt.jpg", category: { id: 3, name: "Clothing" }, stock: 50 },
  { id: 9, name: "Casual T-Shirt", description: "Comfortable cotton t-shirt for everyday wear. Soft fabric with modern fit.", price: 29.99, imageUrl: "/images/casual-tshirt.jpg", category: { id: 3, name: "Clothing" }, stock: 100 },
  { id: 10, name: "Formal Pants", description: "Elegant formal pants with wrinkle-free fabric. Professional look for office wear.", price: 89.99, imageUrl: "/images/formal-pants.jpg", category: { id: 3, name: "Clothing" }, stock: 45 },
];

export const SAMPLE_CATEGORIES = [
  { id: 1, name: "Electronics", description: "Gadgets, devices, and electronic equipment" },
  { id: 2, name: "Footwear", description: "Shoes, sneakers, and footwear for all occasions" },
  { id: 3, name: "Clothing", description: "Apparel including shirts, pants, and casual wear" },
];

export const getProductById = (id) => {
  return SAMPLE_PRODUCTS.find(p => p.id === parseInt(id)) || null;
};

export const getProductsByCategory = (categoryId) => {
  if (!categoryId) return SAMPLE_PRODUCTS;
  return SAMPLE_PRODUCTS.filter(p => p.category?.id === parseInt(categoryId));
};
