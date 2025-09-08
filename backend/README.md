---

## 🚀 Getting Started

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Set up environment variables

- Copy `.env.example` to `.env` (if present).
- Fill in required values (e.g., database URL, JWT secret).

### 3. Set up the database

- Update your database connection string in `.env`.
- Run Prisma migrations:

```bash
npx prisma migrate dev
```

### 4. Start the backend server

```bash
npm run dev
```

- The server will start on [http://localhost:4000](http://localhost:4000) (default, check your config).

---

## 🧑‍💻 Development

- **Linting:**
  ```bash
  npm run lint
  ```
- **Formatting:**  
  Use Prettier or your preferred formatter.
- **Prisma:**
  - Update schema in `src/prisma/schema.prisma`
  - Run `npx prisma generate` after changes

---

## 📚 Usage

- **GraphQL Endpoint:**  
  [http://localhost:4000/graphql](http://localhost:4000/graphql)
- **REST Endpoints:**  
  See `src/routes/` for available routes.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📝 License

[MIT](../LICENSE) (or your preferred license)

---

## 📬 Contact

For questions or feedback, open an issue or contact the maintainer.
