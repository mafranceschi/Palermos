import { connection } from "next/server";
import { countUsers } from "@/lib/users";
import { LoginForm } from "./LoginForm";

export default async function LoginPage() {
  // Depende de la base (¿hay usuarios?), así que no se prerenderiza en el build.
  await connection();
  const needsSetup = (await countUsers()) === 0;
  return <LoginForm mode={needsSetup ? "setup" : "login"} />;
}
