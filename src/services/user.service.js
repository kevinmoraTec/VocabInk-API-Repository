import {models} from '../libs/sequelize.js';
import boom from '@hapi/boom';
import sequelize from '../libs/sequelize.js';


class Users {
  constructor() {
  }

  async getAllUsers() {
    return models.User.findAll();
  }

  async getUserById(id) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user;
  }


  async getUserByEmail(email) {
    const user = await models.User.findOne({ where: { email } });
    if (!user) {
      return false;
    }
    return user;
  }

  async createUser(user) {
try {
   const [newUser, created] = await models.User.findOrCreate({
            where: { email: user.email },
            defaults: user
        });

        if (!created) {
            throw new boom.conflict('User already exists');
        }       

        return newUser;
} catch (error) {
  console.error(error);
  throw error;
}
  }

  async updateUser(id, updatedInfo) {
    const user = await models.User.findByPk(id);
    if (!user) {
      throw boom.notFound('User not found');
    }
    return user.update(updatedInfo);
  }

  async deleteUser(id) {
    const user = await models.User.findByPk(id);
    if (user) {
      await user.destroy();
      return user;
    }else{
        throw boom.notFound('User not found');
    }
  }

  async onboardingUserProcess(id, onboardingData) {

    console.log('I recived this in my logic service');
    console.log('User ID:', id);
    console.log('Onboarding Data:', onboardingData);

    const onboardingFinal = {
        onboarding:{
      ...onboardingData
      }
    };

    const dataOnboardingSaved = await this.updateUser(id, {profile_config: onboardingFinal,onboarding_completed: true});

    console.log(dataOnboardingSaved);
    
    return dataOnboardingSaved.onboarding_completed;
    

    


  }
}

export default  Users