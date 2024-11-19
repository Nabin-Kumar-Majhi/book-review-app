// import { AppShell } from "../components/app-shell";
import { Toaster } from "react-hot-toast";
import { LoginForm } from "../components/auth/login-form";
import { AppShell } from "../components/app-shell";

export function LoginPage() {
  return (
    <AppShell>
      <div>
        <LoginForm />
      </div>
      <Toaster />
    </AppShell>
  );
}
