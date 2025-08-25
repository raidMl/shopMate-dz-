# Admin UI for E-commerce Management

This project is an Admin UI for managing orders, products, and statistics in an e-commerce application. It allows for CRUD operations on orders and products, and includes functionality for generating QR codes for orders.

## Features

- **Order Management**: Create, read, update, and delete orders.
- **Product Management**: Create, read, update, and delete products.
- **Statistics Dashboard**: View various statistics related to orders and products.
- **QR Code Generation**: Generate and display QR codes for orders.

## Project Structure

```
admin-ui
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── common
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── orders
│   │   │   ├── OrderList.tsx
│   │   │   ├── OrderForm.tsx
│   │   │   └── OrderQRCode.tsx
│   │   ├── products
│   │   │   ├── ProductList.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   └── ProductCard.tsx
│   │   └── dashboard
│   │       ├── Dashboard.tsx
│   │       └── Statistics.tsx
│   ├── hooks
│   │   ├── useOrders.ts
│   │   ├── useProducts.ts
│   │   └── useStats.ts
│   ├── services
│   │   ├── api.ts
│   │   ├── orderService.ts
│   │   └── productService.ts
│   ├── types
│   │   ├── order.ts
│   │   ├── product.ts
│   │   └── index.ts
│   ├── utils
│   │   ├── qrCode.ts
│   │   └── helpers.ts
│   ├── styles
│   │   └── globals.css
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Getting Started

1. **Clone the repository**:
   ```
   git clone <repository-url>
   cd admin-ui
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the application**:
   ```
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.