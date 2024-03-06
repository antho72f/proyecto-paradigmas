import {
  ChartBarIcon,
  UserCircleIcon,
  FolderOpenIcon,
  Cog6ToothIcon,
  ServerStackIcon,
  RectangleStackIcon
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <ChartBarIcon {...icon} />,
        name: "chat",
        path: "/chat",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "perfil",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <FolderOpenIcon {...icon} />,
        name: "historial",
        path: "/historial",
        element: <Tables />,
      },
      {
        icon: <Cog6ToothIcon {...icon} />,
        name: "configuracion",
        path: "/configurations",
        element: <Notifications />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
