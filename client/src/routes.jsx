import { createBrowserRouter } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import Verify2FA from "./pages/Verify2FA"
import Setup2FA from "./pages/Setup2FA"
import HomePage from "./pages/HomePage"
import GoogleSuccessPage from "./pages/GAuthSuccess"
import Error from "./pages/Error"
import { PaymentSuccess } from "./pages/PaymentSuccess"
import { PaymentCancelled } from "./pages/PaymentCanceled"
import MyPaymentsPage from "./pages/MyPayments"
import MySessionsPage from "./pages/MySessions"
import ProfilePage from "./pages/ProfilePage"

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
      {
        path: "/success",
        element: <PaymentSuccess/>,
        errorElement: <Error />
      },
      {
        path: "/cancel",
        element: <PaymentCancelled/>,
        errorElement: <Error />
      },
      {
        path: "/my-payments",
        element: <MyPaymentsPage/>,
        errorElement: <Error/>
      },
      {
        path: "/my-sessions",
        element: <MySessionsPage />,
        errorElement: <Error/>
      },
      {
        path: "/profile",
        element: <ProfilePage/>,
        errorElement: <Error/>
      }
    ]
  }
])