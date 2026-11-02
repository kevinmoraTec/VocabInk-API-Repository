'use strict';

import { randomUUID } from 'crypto';

/** @type {import('sequelize-cli').Migration} */

  export async function up (queryInterface, Sequelize) {
    
    return queryInterface.bulkInsert('system_templates', [
      {

        id: randomUUID(),
        name: 'Lesson Learned',
        description: 'Share a story about something you learned',
        ai_prompt: `Today I learned about {WORD} while working on {CONTEXT}.

Here's what made it click:

1️⃣ {KEY_INSIGHT}

2️⃣ {PRACTICAL_EXAMPLE}

3️⃣ {APPLICATION}

Have you tried {WORD} in your projects? Share your experience below! 👇

#SoftwareDevelopment #Learning #Techniques`,
        structure:null,       
        example_preview: null,
        is_active: true,
        usage_count: 0,
        icon: '💡',
      },

      {
        id: randomUUID(),
        name: 'Technical Tip',
        description: 'Share a how-to or technical insight',
        ai_prompt: `Quick tip that saved me hours of debugging ⚡

The problem: {PROBLEM}

The solution: Using {WORD}

Here's how:
→ {STEP_1}
→ {STEP_2}
→ {STEP_3}

Pro tip: {PRO_TIP}

Save this for later! 🔖

#DevTips #Programming #CodeNewbie`,
        structure:null,       
        example_preview: null,
        is_active: true,
        usage_count: 0,
        icon: '✅', //a🔧
      },

      {
        id: randomUUID(),
        name: 'Career Reflection',
        description: 'Share personal growth insights',
        ai_prompt: `A lesson from my journey as a developer 🌱

When I first heard about {WORD}, I was confused.

Now, after {TIME_PERIOD}, I understand why it matters:

✨ {INSIGHT_1}
✨ {INSIGHT_2}
✨ {INSIGHT_3}

The key takeaway: {TAKEAWAY}

What's a concept that took you time to truly understand?

#CareerGrowth #TechJourney #SoftwareEngineering`,
        structure:null,       
        example_preview: null,
        is_active: true,
        usage_count: 0,
        icon: '🚀',
      },


    ]);

  }

  export async function down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('system_templates', null, {});


  }

