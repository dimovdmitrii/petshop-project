export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://petshop-project-backend.vercel.app"
    : "http://localhost:3333";
