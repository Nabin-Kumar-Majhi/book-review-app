// import { AppShell } from "../components/app-shell";

import { Toaster } from "react-hot-toast";
import { RegisterForm } from "../components/auth/register-form";
import { AppShell } from "../components/app-shell";

export function RegisterPage() {
  return (
    <AppShell>
      <RegisterForm />
      <Toaster />
    </AppShell>
  );
}
