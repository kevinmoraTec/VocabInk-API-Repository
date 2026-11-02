import express from 'express'
const router = express.Router();
import usersService from '../services/user.service.js'; 
import {validatorHandler} from '../middlewares/validator.handler.js';
import { CreateUserSchema } from '../schemas/user.schema.js';
const serviceUsers = new usersService();

router.get('/', (req, res,next) => {
try {
        console.log('User Router');

    const allUsers = serviceUsers.getAllUsers();
    console.log(allUsers);

    console.log('User-Service-Poo');
    
    console.log(serviceUsers.users);
    
    
    res.send('User route is working!');
} catch (error) {
    next(error);
}
});

router.post('/',
    validatorHandler(CreateUserSchema, 'body'),
    (req, res,next) => {
    try {
        const body = req.body;
        const newUser = serviceUsers.createUser(body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
});

 router.patch('/onboarding/:id', async (req, res,next) => {

    const { id } = req.params;
    const dataOnboarding = req.body;

    try {
        // const updatedUser = await serviceUsers.updateUser(id, { onboardingCompleted });
        // res.json(updatedUser);

        console.log('Data received');
        console.log('User ID:', id);
        console.log('Onboarding Completed:', dataOnboarding);

        const dataServiceOnboarding = await serviceUsers.onboardingUserProcess(id, dataOnboarding);
        
        res.json({ message: 'Onboarding data processed successfully', dataServiceOnboarding });

    } catch (error) {
        next(error);
    }

});





export default router; 