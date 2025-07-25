import {Request , Response , Router} from 'express'
import { sendConnectionRequest   ,reviewConnectionRequest , requests , connections } from '../controllers/connectionRequest.controller';
import { isAuthenticated } from '../middlewares/user.middleware';
import { RequestPart, validate } from '../middlewares/validate.middleware';
import { requestSchema, reviewSchema } from '../schemas/connectionRequest.schema';

const router : Router = Router()

/* same api for interested and ignored */
router.post("/send/:status/:userId" ,isAuthenticated , validate(requestSchema , RequestPart.PARAMS) , sendConnectionRequest )

/* same api for accepted and rejected */
router.post("/review/:status/:reqId" ,isAuthenticated ,validate(reviewSchema , RequestPart.PARAMS), reviewConnectionRequest )

router.get("/all_connections" ,isAuthenticated , connections )
router.get("/requests" ,isAuthenticated , requests )


export default router;
