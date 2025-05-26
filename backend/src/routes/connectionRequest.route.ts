import {Request , Response , Router} from 'express'
import { sendConnectionRequest   ,reviewConnectionRequest , fetchConnectionRequests , fetchConnections } from '../controllers/connectionRequest.controller';
import { isAuthenticated } from '../middlewares/user.middleware';
import { validate } from '../middlewares/validate.middleware';
import { requestSchema, reviewSchema } from '../schemas/connectionRequest.schema';

const router : Router = Router()

/* same api for interested and ignored */
router.post("/send/:status/:userId" ,isAuthenticated , validate(requestSchema , "params") , sendConnectionRequest )

/* same api for accepted and rejected */
router.post("/review/:status/:reqId" ,isAuthenticated ,validate(reviewSchema , "params"), reviewConnectionRequest )

router.get("/all_connections" ,isAuthenticated , fetchConnections )
router.get("/requests" ,isAuthenticated , fetchConnectionRequests )


export default router;
