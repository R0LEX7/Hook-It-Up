import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/user.middleware";
import { getFeed } from "../controllers/feed.controller";

const router : Router = express.Router();


router.get('/' , isAuthenticated , getFeed);

export default router;
