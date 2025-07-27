import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import LoginForm from "./LoginForm";
import { authOptions } from "../api/auth/[...nextauth]/route";

declare module "next-auth" {
  interface User {
    role?: string;
    choklaId?: string;
    villageId?: string
  }
  interface Session {
    user?: User;
  }
}

export default async function LoginPage() {
  // Get the session on the server
  const session = await getServerSession(authOptions);

  // If already logged in, redirect based on role
  if (session?.user?.role === "SUPER_ADMIN") {
    redirect("/admin/superadmin");
  } else if (session?.user?.role === "VILLAGE_MEMBER") {
    redirect(`/admin/village/${session.user.villageId}`);
  } else if (session?.user?.role === "CHOKHLA_MEMBER") {
    redirect(`/admin/chokhla/${session?.user?.choklaId}`);
  }

  // Otherwise, render the login form
  return <LoginForm />;
}
