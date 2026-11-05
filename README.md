# 📚 BookNook – Online Book Library

BookNook is a modern online book library application where users can explore books, view book details, add and manage their own books, and borrow or return books.

## 🌐 Live Website
[Visit BookNook](https://book-nook-client-ashen.vercel.app/)

## ✨ Features

- **User Authentication:** Register and log in using email and password.
- **Google Login:** Sign in with Google.
- **Homepage:** Explore the library through an attractive homepage and hero slider.
- **All Books:** Browse available books with search and category filtering.
- **Book Details:** View detailed information about individual books.
- **Add Book:** Add new books to the library.
- **My Books:** Manage your added books, including editing and deleting.
- **Borrow Books:** Borrow books and track borrowing information.
- **Return Books:** Return borrowed books.
- **Protected Routes:** Restrict private pages to authenticated users.
- **Responsive Design:** Works on desktop, tablet, and mobile devices.

## 🛠️ Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Better Auth
- MongoDB
- Lucide React
- React Hot Toast
- Swiper

## 📂 Project Structure

```text
booknook-client/
├── public/
├── src/
│   ├── app/
│   │   ├── add-book/
│   │   ├── books/
│   │   ├── login/
│   │   ├── register/
│   │   ├── my-books/
│   │   ├── my-borrows/
│   │   └── profile/
│   ├── components/
│   └── lib/
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/tamanna141101/BookNook-Client.git
```

### 2. Navigate to the Project

```bash
cd BookNook-Client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root and add:

```env
MONGODB_URI=your_mongodb_connection_string
DB_NAME=booknook
BETTER_AUTH_SECRET=your_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace the placeholder values with your actual credentials. Never commit secret keys or environment files to GitHub.

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔗 Backend Repository

[BookNook Server](https://github.com/tamanna141101/BookNook-Server)

## 👩‍💻 Developer

**Tamanna Islam**

- GitHub: [tamanna141101](https://github.com/tamanna141101)
- LinkedIn: [Tamanna Islam](https://www.linkedin.com/in/tamannaislam14/)

---

⭐ If you find this project interesting, feel free to explore the repository!
