🚀 GraphQL Backend Assessment Project

A complete backend application built with Node.js, Apollo Server, GraphQL, Prisma, PostgreSQL, Handlebars, Puppeteer, and Nodemailer.

⚙️ Setup Instructions

git clone <your-repo-url>
cd graphql_assessment
npm install
npx prisma generate

⚙️ DOCKER SETUP
docker-compose up

3️⃣ Configure environment variables

# PostgreSQL connection
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/mydb?schema=public"

# JWT
JWT_SECRET="supersecretkey"

# Server
PORT=4000
BASE_URL=http://localhost:4000

# Storage (local by default)
STORAGE=local

# SMTP (optional — leave empty to use Ethereal)
FROM_EMAIL="no-reply@example.com"


# Run the development server

npm start
Now open your GraphQL endpoint:
👉 http://localhost:4000/graphql

# directly click to this endpoint or add in postman.

🧩 GraphQL Queries & Mutations

🔑 Register
mutation {
  register(name: "Jyoti", email: "jyoti@example.com", password: "123456") {
    id
    name
    email
  }
}

🔐 Login
mutation {
  login(email: "jyoti@example.com", password: "123456") {
    token
    user {
      id
      name
      email
    }
  }
}

🧍‍♀️ Get Current User
query {
  me {
    id
    name
    email
    role
  }
}

Token require
Authorization: Bearer <token>

🗂 Upload File
mutation($file: Upload!) {
  uploadFile(file: $file) {
    id
    filename
    url
    mimetype
    uploadedAt
  }
}

📄 Create Document (HTML → PDF)
mutation CreateDoc($title: String!, $data: JSON!, $email: String) {
  createDocument(title: $title, templateData: $data, sendEmailTo: $email) {
    id
    title
    pdfUrl
  }
}

# Variables
{
  "title": "Project Report",
  "data": {
    "project": "GraphQL Assessment",
    "developer": "Jyoti Bissoyi",
    "status": "In Progress"
  },
  "email": "jyoti@example.com"
}

📧 Nodemailer Test Output Example

When you run a createDocument mutation with sendEmailTo,
you’ll see this in your terminal:

🧪 Using Ethereal test account: abcd1234@ethereal.email
📧 Preview email at: https://ethereal.email/message/YOUR-LINK

✅ Click the link to preview the sent email in your browser.
