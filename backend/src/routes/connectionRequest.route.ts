import {Request , Response , Router} from 'express'
import { sendInterestRequest   ,acceptConnectionRequest , fetchConnectionRequests , fetchConnections ,ignoreConnectionRequest, rejectConnectionRequest} from '../controllers/connectionRequest.controller';
import { isAuthenticated } from '../middlewares/user.middleware';

const router : Router = Router()

router.post("/send/interested/:userId" ,isAuthenticated , sendInterestRequest )
router.post("/send/ignored/:userId" ,isAuthenticated , ignoreConnectionRequest )
router.post("/review/rejected/:reqId" ,isAuthenticated , rejectConnectionRequest )
router.post("/review/accepted/:reqId" ,isAuthenticated , acceptConnectionRequest )
router.get("/all/connections" ,isAuthenticated , fetchConnections )
router.get("/requests" ,isAuthenticated , fetchConnectionRequests )


export default router;
