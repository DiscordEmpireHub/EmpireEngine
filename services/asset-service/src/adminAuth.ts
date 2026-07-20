import type { NextFunction, Request, Response } from "express";

export function createAdminAuthMiddleware(adminApiKey: string) {
  return function adminAuth(req: Request, res: Response, next: NextFunction): void {
    const providedKey = req.header("x-admin-api-key");
    if (providedKey !== adminApiKey) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    next();
  };
}
