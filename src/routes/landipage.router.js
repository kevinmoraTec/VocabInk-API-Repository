import express from 'express';
const router = express.Router();
 import LandiPageService from '../services/landipage.service.js'; 
 import {validatorHandler} from '../middlewares/validator.handler.js';
 import { CreateEmailLandiPageSchema } from '../schemas/landipage.schema.js';
const serviceLandiPage = new LandiPageService();

router.post('/',
    validatorHandler(CreateEmailLandiPageSchema,'body'),
    async (req, res,next) => {
    try {
        const body = req.body;
        
         const newEmailLandiPage =  await serviceLandiPage.createEmailLandiPage(body);

         res.json(newEmailLandiPage);
        
    } catch (error) {
        next(error);
    }
});

export default router;