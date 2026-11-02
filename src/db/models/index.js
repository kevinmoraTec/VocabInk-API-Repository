import {emailLandiPageSchema,EmailLandiPage} from './emails.landipage.model.js';
import {userSchema,User} from './user.model.js';
import {CategoryVocabulary,categoryVocabularySchema} from './category_vocabulary.model.js';
import {Vocabulary,vocabularySchema} from './vocabulary.model.js';
import {SystemTemplate,systemTemplateSchema} from './system.template.model.js'
import {GeneratedPost,generatedPostsSchema} from './generated_posts.model.js'
import {PostVocabulary,postVocabularySchema} from './post_vocabulary.model.js';
import {UserStat,userStatSchema} from './user.stat.model.js';
import {Feedback,feedbackSchema} from './feedback.model.js'
import {PostActions,postActionsSchema} from './postActions.model.js';
export default function setupModels(sequelize) {

    EmailLandiPage.init(emailLandiPageSchema, EmailLandiPage.config(sequelize));    
    User.init(userSchema, User.config(sequelize));
    CategoryVocabulary.init(categoryVocabularySchema, CategoryVocabulary.config(sequelize));
    Vocabulary.init(vocabularySchema, Vocabulary.config(sequelize));
    SystemTemplate.init(systemTemplateSchema, SystemTemplate.config(sequelize));
    GeneratedPost.init(generatedPostsSchema, GeneratedPost.config(sequelize));
    PostVocabulary.init(postVocabularySchema, PostVocabulary.config(sequelize));
    UserStat.init(userStatSchema, UserStat.config(sequelize));
    Feedback.init(feedbackSchema, Feedback.config(sequelize));
    PostActions.init(postActionsSchema, PostActions.config(sequelize));
    // Call associate methods to set up relationships
    User.associate(sequelize.models);
    CategoryVocabulary.associate(sequelize.models);
    Vocabulary.associate(sequelize.models);
    SystemTemplate.associate(sequelize.models);
    GeneratedPost.associate(sequelize.models);
    PostVocabulary.associate(sequelize.models);
    UserStat.associate(sequelize.models);
    Feedback.associate(sequelize.models);
    PostActions.associate(sequelize.models);
}
