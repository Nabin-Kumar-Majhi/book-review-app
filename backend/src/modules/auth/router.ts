import { Router } from "express";
import { checkAuth, loginController, logoutController, meController, permitAdmin, registerController, updateRoleController } from "./controller";


function createAuthRouter() {
  const router = Router();
  router.post("/register", registerController);
  router.post("/login", loginController);
  router.get("/me", checkAuth, meController);
  router.post("/logout", checkAuth, logoutController);
  router.post("/update-role", checkAuth, permitAdmin, updateRoleController);
  return router;
}

export const authRouter = createAuthRouter();
