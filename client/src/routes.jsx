import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import Verify2FA from "./pages/Verify2FA"
import Setup2FA from "./pages/Setup2FA"
import HomePage from "./pages/HomePage"
import GoogleSuccessPage from "./pages/GAuthSuccess"
import Error from "./pages/Error"

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <Error />
  },
  {
    path: "/google-success",
    element: <GoogleSuccessPage/>
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <HomePage />,
        errorElement: <Error />
      },
      {
        path: "/setup-2fa",
        element: <Setup2FA />,
        errorElement: <Error />
      },
      {
        path: "/verify-2fa",
        element: <Verify2FA />,
        errorElement: <Error />
      },
    ]
  }
])