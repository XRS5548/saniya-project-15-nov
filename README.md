# 🛒 E-Commerce Web Application (React + TypeScript + Vite)

A responsive e-commerce web application where users can browse products, view detailed product information, and manage items in the shopping cart.  
Built using **React, TypeScript, Context API, React Router**, and **FakeStoreAPI**.

---

## 🚀 Tech Stack

- **Vite** (React + TypeScript)
- **React Router**
- **React Context API**
- **FakeStoreAPI**
- **CSS (Flex/Grid)**

---

## 📂 Folder Structure
```bash
src/
│── api/
│ └── products.ts
│
│── assets/
│ └── react.svg
│
│── components/
│ ├── FilterBar.tsx
│ ├── Footer.tsx
│ ├── ProductCard.tsx
│ └── Products.tsx
│
│── layout/
│ └── navbar.tsx
│
│── pages/
│ ├── Cart.tsx
│ ├── Details.tsx
│ └── Home.tsx
│
│── App.tsx
│── main.tsx
│── index.css
```

---

## 📌 Features

### **1. Home Page**
- Displays all products in a responsive grid.
- Products fetched via FakeStoreAPI.
- Includes:
  - Category filter  
  - Sorting options  
- Filters remain active on refresh.

---

### **2. Product Detail Page**
- Dynamic routing: `/product/:id`
- Fetches product info using product ID.
- Displays:
  - Image  
  - Title  
  - Category  
  - Price  
  - Description  
  - **Add to Cart** button  

---

### **3. Cart Page**
- Add items to the cart.
- Remove items from the cart.
- Shows:
  - Total items  
  - Total price  
- Global cart state via **Context API**.

---

### **4. Navigation**
- Implemented using **React Router**.
- Pages:
  - Home  
  - Product Details  
  - Cart  
- Includes a **Back to Home** navigation button.

---

## 🔗 API Used

### **FakeStoreAPI**
All product details and categories are fetched from:
https://fakestoreapi.com/


---

## ▶️ How to Run Locally

### **1. Clone the repository**
```bash
git clone https://github.com/Saniya-khan68/E-commerce
cd E-commerce
npm install

npm run dev

npm run build

```