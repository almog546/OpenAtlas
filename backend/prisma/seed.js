const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

function daysAgo(days, hour = 12, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function pick(arr, index) {
  return arr[index % arr.length];
}

function buildRichTextArticle(spec) {
  return `
    <h1>${spec.title}</h1>
    <p>${spec.hook}</p>
    <p>${spec.tension}</p>

    <h2>Why this matters</h2>
    <p>${spec.theme} matters because it shapes how people experience the product, the work, or the decision long before they can fully explain what they are reacting to. In practice, the difference between progress and drift often comes from whether a person or team builds repeatable structure around the thing they claim to value.</p>
    <p>Most people do not fail because they lack awareness. They fail because they keep returning to the same friction without changing the environment around it. That is why good systems beat temporary intensity. A clean process removes hesitation and turns a good intention into normal behavior.</p>

    <h2>The mistake most people make</h2>
    <p>${spec.tension} When that pattern repeats for long enough, the result is not only slower progress. It also creates confusion. People start thinking the problem is talent, motivation, or luck when the real issue is usually weak design around the behavior itself.</p>
    <p>In real projects, this shows up everywhere. Teams overbuild before validating. Writers publish vague work instead of specific work. Product decisions get buried under visual noise. Engineers keep adding features while the foundation becomes harder to reason about. The mistake is rarely dramatic. It is usually small, repeated, and tolerated for too long.</p>

    <blockquote>${spec.insight}</blockquote>

    <h2>What strong execution looks like</h2>
    <p>Better execution usually begins with restraint. Instead of expanding the scope, strong builders reduce the number of variables that can go wrong. They define the goal more clearly, remove unnecessary decisions, and protect the handful of actions that actually create leverage.</p>
    <p>This is the part people tend to underestimate. They want bigger ambition, but what they actually need is tighter structure. Once the structure improves, consistency stops feeling forced. It becomes easier to repeat the work because the system is no longer fighting the person using it.</p>
    <ul>
      <li>Reduce friction before asking for more discipline.</li>
      <li>Make the next action obvious and realistically repeatable.</li>
      <li>Use clarity as a tool for trust, speed, and better decisions.</li>
      <li>Let consistency create evidence before chasing intensity.</li>
    </ul>

    <h2>What this changes over time</h2>
    <p>When ${spec.theme.toLowerCase()} is handled well, the benefits compound quietly. People trust the interface more quickly, writers sound more grounded, teams ship with less drama, and users understand what to do without needing to be guided through every detail. The visible output improves, but so does the confidence behind it.</p>
    <p>That long-term effect is why seemingly small choices matter. Good systems reduce internal negotiation. Good design reduces doubt. Good architecture reduces future complexity. The first win is usually practical, but the deeper win is psychological: people begin to trust the process because it keeps working under normal conditions.</p>

    <h2>Final thought</h2>
    <p>${spec.takeaway}</p>
    <p>The strongest projects rarely feel magical from the inside. They feel clear. They feel maintained. They feel intentional. That is usually the result of many ordinary decisions made well, not one dramatic breakthrough.</p>
  `.replace(/\n\s+/g, '').trim();
}

function buildDraftHtml(title, topic, lesson) {
  return `
    <h1>${title}</h1>
    <p>This draft explores ${topic.toLowerCase()} from a practical angle rather than a motivational one.</p>
    <p>The core idea is simple: when people reduce friction and increase clarity, better behavior becomes easier to repeat.</p>
    <h2>Main angle</h2>
    <p>${lesson}</p>
    <p>The next version of this article should include more examples, a stronger opening section, and one concrete framework readers can apply immediately.</p>
  `.replace(/\n\s+/g, '').trim();
}

function buildComment(spec, commentIndex) {
  const starters = [
    'Strong piece.',
    'Really solid article.',
    'This was a good read.',
    'Very sharp breakdown.',
    'I liked this a lot.',
    'This felt practical.',
    'Good article overall.',
  ];

  const bodies = [
    `The point about ${spec.theme.toLowerCase()} felt especially strong because it stayed concrete instead of generic.`,
    `I liked how you framed the problem around structure rather than motivation.`,
    `The section about repeated small mistakes was probably the most useful part for me.`,
    `This explained the tradeoff clearly without overcomplicating it.`,
    `The part about trust and clarity landed well.`,
    `I think more people need to hear this because the issue shows up in almost every project.`,
    `The takeaway was strong and felt realistic instead of idealistic.`,
  ];

  return `${pick(starters, commentIndex)} ${pick(bodies, commentIndex + spec.title.length)}`;
}

function buildReply(spec, replyIndex) {
  const replies = [
    `Thanks. I wanted the article to feel usable, not just polished.`,
    `Exactly. The real issue is usually the system around the work, not the lack of effort itself.`,
    `That was the goal. If the structure is clear, people can actually apply the idea.`,
    `Agreed. ${spec.insight}`,
  ];
  return pick(replies, replyIndex);
}

async function main() {
  console.log('Starting large demo seed...');


  await prisma.notification.deleteMany();
  await prisma.report.deleteMany();
  await prisma.bookmark.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.reply.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.postHistory.deleteMany();
  await prisma.draft.deleteMany();
  await prisma.post.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('DemoPass123!', 10);

  
  const usersData = [
    {
      username: 'admin',
      name: 'Michael Carter',
      role: 'ADMIN',
      bio: 'Site administrator. Reviews reports, manages moderation, and monitors platform activity.',
    },
    {
      username: 'ethanparker',
      name: 'Ethan Parker',
      role: 'USER',
      bio: 'Writes about productivity, systems, consistency, and building work that actually compounds.',
    },
    {
      username: 'oliviabrooks',
      name: 'Olivia Brooks',
      role: 'USER',
      bio: 'Frontend-focused writer covering interface clarity, product trust, and clean user experience.',
    },
    {
      username: 'liamturner',
      name: 'Liam Turner',
      role: 'USER',
      bio: 'Backend engineer writing about architecture, APIs, modeling, and practical engineering tradeoffs.',
    },
    {
      username: 'sophiabennett',
      name: 'Sophia Bennett',
      role: 'USER',
      bio: 'Writes about writing, career growth, publishing, and how to create work with a clear point of view.',
    },
    {
      username: 'noahcollins',
      name: 'Noah Collins',
      role: 'USER',
      bio: 'Interested in systems, programming, shipping, and keeping projects simple enough to finish.',
    },
    {
      username: 'emmachase',
      name: 'Emma Chase',
      role: 'USER',
      bio: 'Writes about product experience, web flows, onboarding, and what makes digital tools feel polished.',
    },
    {
      username: 'jacksonreed',
      name: 'Jackson Reed',
      role: 'USER',
      bio: 'Frontend builder focused on CSS structure, maintainable components, and readable interfaces.',
    },
    {
      username: 'avahughes',
      name: 'Ava Hughes',
      role: 'USER',
      bio: 'Interested in mobile and product usability, especially how people experience speed and simplicity.',
    },
    {
      username: 'lucasgray',
      name: 'Lucas Gray',
      role: 'USER',
      bio: 'Writes about notifications, dashboards, user behavior, and reducing unnecessary product noise.',
    },
    {
      username: 'miarussell',
      name: 'Mia Russell',
      role: 'USER',
      bio: 'Focused on visual hierarchy, content presentation, and making pages easier to scan and trust.',
    },
    {
      username: 'benjaminward',
      name: 'Benjamin Ward',
      role: 'USER',
      bio: 'Writes about operations, business execution, and why structure matters more than hype.',
    },
    {
      username: 'charlotteprice',
      name: 'Charlotte Price',
      role: 'USER',
      bio: 'Interested in marketing, positioning, and why people respond to clarity more than complexity.',
    },
    {
      username: 'henrycooper',
      name: 'Henry Cooper',
      role: 'USER',
      bio: 'Security-minded builder writing about practical habits, safer defaults, and reducing preventable risk.',
    },
    {
      username: 'ameliascott',
      name: 'Amelia Scott',
      role: 'USER',
      bio: 'Writes about community features, product behavior, and the systems that help platforms feel active.',
    },
    {
      username: 'danielross',
      name: 'Daniel Ross',
      role: 'USER',
      bio: 'Interested in analytics, finance, and how better measurement changes what teams actually improve.',
    },
    {
      username: 'graceadams',
      name: 'Grace Adams',
      role: 'USER',
      bio: 'Writes about education, learning, and why explaining ideas is the best way to make them stick.',
    },
    {
      username: 'masonkelly',
      name: 'Mason Kelly',
      role: 'USER',
      bio: 'Startup-focused writer covering demos, shipping, scope control, and how products earn momentum.',
    },
    {
      username: 'evelynmorris',
      name: 'Evelyn Morris',
      role: 'USER',
      bio: 'Writes about health, consistency, recovery, and building routines that survive normal life.',
    },
  ];

  const usersByUsername = {};

  for (let i = 0; i < usersData.length; i++) {
    const user = usersData[i];
    const createdUser = await prisma.user.create({
      data: {
        username: user.username,
        name: user.name,
        password: hashedPassword,
        role: user.role,
        createdAt: daysAgo(60 - i * 2, 9 + (i % 7), 0),
        profile: {
          create: {
            bio: user.bio,
            avatar: `https://i.pravatar.cc/300?u=${user.username}`,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    usersByUsername[user.username] = createdUser;
  }

  const regularUsers = Object.values(usersByUsername).filter((u) => u.role === 'USER');


  const followRows = [];
  const followNotifications = [];

  for (let i = 0; i < regularUsers.length; i++) {
    const follower = regularUsers[i];
    const targetIndexes = [1, 3, 5, 7].filter((offset, idx) => (i + idx) % 2 === 0 || idx < 3);

    for (const offset of targetIndexes) {
      const following = regularUsers[(i + offset) % regularUsers.length];
      if (following.id === follower.id) continue;

      followRows.push({
        followerId: follower.id,
        followingId: following.id,
        createdAt: daysAgo(30 - ((i + offset) % 12), 10 + (i % 8), 0),
      });
    }
  }

 
  const ethan = usersByUsername.ethanparker;
  const extraFollowers = [
    'oliviabrooks',
    'liamturner',
    'sophiabennett',
    'noahcollins',
    'emmachase',
    'jacksonreed',
    'avahughes',
    'lucasgray',
    'miarussell',
    'benjaminward',
    'charlotteprice',
  ];

  for (let i = 0; i < extraFollowers.length; i++) {
    const follower = usersByUsername[extraFollowers[i]];
    followRows.push({
      followerId: follower.id,
      followingId: ethan.id,
      createdAt: daysAgo(20 - (i % 8), 11 + (i % 6), 0),
    });
  }

  
  const uniqueFollowMap = new Map();
  for (const row of followRows) {
    const key = `${row.followerId}-${row.followingId}`;
    if (!uniqueFollowMap.has(key) && row.followerId !== row.followingId) {
      uniqueFollowMap.set(key, row);
    }
  }
  const uniqueFollows = [...uniqueFollowMap.values()];

  await prisma.follow.createMany({
    data: uniqueFollows,
    skipDuplicates: true,
  });

  for (const follow of uniqueFollows) {
    followNotifications.push({
      userId: follow.followingId,
      actorId: follow.followerId,
      type: 'follow',
      isRead: Math.random() > 0.5 ? false : true,
      createdAt: follow.createdAt,
    });
  }

 
  const postSpecs = [
    {
      title: 'Discipline Is Built on Ordinary Days',
      category: 'productivity',
      authorUsername: 'ethanparker',
      theme: 'Discipline',
      hook: 'Most people imagine discipline as something dramatic, but real discipline is usually built in ordinary days that do not feel important while they are happening.',
      tension: 'The mistake is waiting for energy or emotional intensity before acting, instead of building a standard that survives average conditions.',
      insight: 'Consistency matters most when the day feels unremarkable.',
      takeaway: 'If you want stronger results, stop treating ordinary days like they do not count. Most of your future is shaped there.',
    },
    {
      title: 'The Quiet Power of a Clear Interface',
      category: 'webDevelopment',
      authorUsername: 'oliviabrooks',
      theme: 'Interface clarity',
      hook: 'Users often decide how they feel about a product before they fully understand its features.',
      tension: 'The mistake is treating visual clarity like decoration when it is actually part of how trust is formed.',
      insight: 'A clean interface reduces doubt before logic catches up.',
      takeaway: 'Good design is not extra polish. It is part of the product\'s ability to earn confidence.',
    },
    {
      title: 'Backend Choices That Age Badly',
      category: 'softwareEngineering',
      authorUsername: 'liamturner',
      theme: 'Backend architecture',
      hook: 'Scaling problems usually start long before traffic becomes the visible problem.',
      tension: 'Teams often normalize quick shortcuts without noticing that those shortcuts are quietly becoming the shape of the system.',
      insight: 'Small technical compromises compound into structural debt.',
      takeaway: 'Build the system so it stays understandable as it grows, not just functional today.',
    },
    {
      title: 'Why Great Writing Starts With Specificity',
      category: 'career',
      authorUsername: 'sophiabennett',
      theme: 'Writing specificity',
      hook: 'A lot of writing sounds competent and still disappears instantly because it never says anything with real specificity.',
      tension: 'The mistake is trying to sound polished before finding an observation strong enough to carry the piece.',
      insight: 'Specific thought creates stronger writing than decorative language.',
      takeaway: 'Say one thing clearly and precisely before trying to sound impressive.',
    },
    {
      title: 'Small Systems That Protect Focus',
      category: 'lifestyle',
      authorUsername: 'ethanparker',
      theme: 'Focus protection',
      hook: 'Focus is less a personality trait than a consequence of how much chaos your day allows around your work.',
      tension: 'People often blame themselves for distraction when the real problem is an environment full of open loops and weak boundaries.',
      insight: 'Attention improves when ambiguity is reduced before the work begins.',
      takeaway: 'Protect fewer, clearer work blocks instead of demanding endless discipline from yourself.',
    },
    {
      title: 'Shipping Faster Without Lowering Standards',
      category: 'business',
      authorUsername: 'benjaminward',
      theme: 'Shipping discipline',
      hook: 'Teams usually do not move slowly because they care too much about quality. They move slowly because they refuse to choose what quality actually means right now.',
      tension: 'The mistake is keeping too many options alive for too long and calling it careful thinking.',
      insight: 'Shipping gets easier when priorities become narrower and more visible.',
      takeaway: 'A smaller, finished version teaches more than a larger, theoretical one.',
    },
    {
      title: 'What Good Data Models Save You From',
      category: 'programming',
      authorUsername: 'noahcollins',
      theme: 'Data modeling',
      hook: 'Good data models rarely get praise when a project is small, but they save teams from enormous confusion later.',
      tension: 'The mistake is treating modeling as a technical detail instead of a product decision with long-term consequences.',
      insight: 'Clear structure removes future friction before it becomes visible.',
      takeaway: 'Model the product honestly now, and later work becomes cheaper and clearer.',
    },
    {
      title: 'Why Readers Leave Messy Pages Early',
      category: 'marketing',
      authorUsername: 'charlotteprice',
      theme: 'Content readability',
      hook: 'Readers do not leave a page only because the idea is weak. They often leave because the page feels harder to trust than it should.',
      tension: 'The mistake is overloading the page with competing signals instead of helping the eye settle quickly.',
      insight: 'Readability is part of persuasion.',
      takeaway: 'Clean presentation is not cosmetic. It directly affects whether the message gets a real chance.',
    },
    {
      title: 'Building Trust Into Profile Design',
      category: 'technology',
      authorUsername: 'emmachase',
      theme: 'Profile design',
      hook: 'Profiles are often treated like simple identity pages, but they quietly shape how a platform feels socially and structurally.',
      tension: 'The mistake is leaving profile pages underdesigned and then wondering why users do not feel attached to the product.',
      insight: 'People trust systems more when identity feels real and legible.',
      takeaway: 'A good profile page makes the platform feel inhabited, not empty.',
    },
    {
      title: 'The Case for Fewer Features in Version One',
      category: 'startups',
      authorUsername: 'masonkelly',
      theme: 'Version one scope',
      hook: 'Most weak launches are not caused by ambition alone. They are caused by ambition that was never forced into a usable shape.',
      tension: 'The mistake is building toward a fantasy version of the product instead of a version that proves one clear thing.',
      insight: 'Scope control is one of the most important forms of product intelligence.',
      takeaway: 'Version one should prove value, not exhaust every idea you have.',
    },
    {
      title: 'What Makes an Editor Feel Fast',
      category: 'mobileDevelopment',
      authorUsername: 'avahughes',
      theme: 'Editor experience',
      hook: 'Editors feel fast when users stop noticing the tool and stay inside the act of creating.',
      tension: 'The mistake is measuring only technical speed while ignoring friction in the flow of interaction.',
      insight: 'Perceived speed is shaped by interface confidence as much as raw performance.',
      takeaway: 'Reduce hesitation inside the flow and the product immediately feels faster.',
    },
    {
      title: 'Why Teams Drift Without Deadlines',
      category: 'business',
      authorUsername: 'danielross',
      theme: 'Deadlines and momentum',
      hook: 'Projects can stay busy for weeks without actually moving if nothing forces the work into a finished shape.',
      tension: 'The mistake is confusing visible effort with accountable progress.',
      insight: 'Deadlines reveal priorities by forcing exclusion.',
      takeaway: 'A real deadline does not make work important. It makes priorities honest.',
    },
    {
      title: 'The Hidden Cost of Context Switching',
      category: 'productivity',
      authorUsername: 'ethanparker',
      theme: 'Context switching',
      hook: 'People notice interruptions, but they often miss the cognitive residue that stays behind after every unnecessary switch.',
      tension: 'The mistake is scheduling the day in a way that destroys continuity and then blaming your own focus.',
      insight: 'Depth usually disappears through fragmentation, not laziness.',
      takeaway: 'A cleaner schedule protects more output than another burst of motivation ever will.',
    },
    {
      title: 'Comment Sections Need Better Defaults',
      category: 'technology',
      authorUsername: 'ameliascott',
      theme: 'Community design',
      hook: 'Comment sections are often blamed for bad culture when the product itself quietly encourages shallow interaction patterns.',
      tension: 'The mistake is expecting healthy discussion from a system that was not designed to support it.',
      insight: 'Default behavior is product design made visible.',
      takeaway: 'If you want better conversations, design for better incentives before asking users to behave better.',
    },
    {
      title: 'How Notifications Become Noise',
      category: 'technology',
      authorUsername: 'lucasgray',
      theme: 'Notification systems',
      hook: 'Notifications begin as engagement tools and quickly become background irritation when the product does not respect attention.',
      tension: 'The mistake is optimizing for activity volume instead of message value.',
      insight: 'A notification should earn the interruption it creates.',
      takeaway: 'Fewer, sharper notifications create more trust than constant low-value activity.',
    },
    {
      title: 'Why Admin Panels Should Feel Calm',
      category: 'softwareEngineering',
      authorUsername: 'oliviabrooks',
      theme: 'Admin experience',
      hook: 'An admin panel is not just a utility surface. It is a decision environment where clarity directly affects speed and judgment.',
      tension: 'The mistake is treating internal tools like visual afterthoughts even though they often support the highest-leverage actions in the system.',
      insight: 'Operational clarity reduces cognitive drag.',
      takeaway: 'A calm admin experience helps teams act faster with less uncertainty.',
    },
    {
      title: 'The Best Habit Rule Is the Smallest One',
      category: 'health',
      authorUsername: 'evelynmorris',
      theme: 'Habit formation',
      hook: 'People often fail with habits because their rule sounds ambitious but collapses the moment real life becomes inconvenient.',
      tension: 'The mistake is choosing a standard that only works on ideal days.',
      insight: 'Small rules survive where inspiring promises fail.',
      takeaway: 'The best habit is the one you can still execute on an average day.',
    },
    {
      title: 'When Career Advice Becomes Useless',
      category: 'career',
      authorUsername: 'sophiabennett',
      theme: 'Career advice',
      hook: 'Career advice becomes weak the moment it loses contact with the conditions people are actually working inside.',
      tension: 'The mistake is giving broad guidance that sounds right but does not survive contact with real constraints.',
      insight: 'Advice is only useful when it can survive context.',
      takeaway: 'Good advice makes tradeoffs visible instead of pretending every path is equally available.',
    },
    {
      title: 'Why Bookmarks Need a Real Use Case',
      category: 'programming',
      authorUsername: 'noahcollins',
      theme: 'Bookmark behavior',
      hook: 'A bookmark feature looks useful by default, but many products add it without understanding what it is supposed to help users do later.',
      tension: 'The mistake is building storage instead of retrieval value.',
      insight: 'Saved items only matter if users can meaningfully return to them.',
      takeaway: 'A bookmark system should support future action, not just future clutter.',
    },
    {
      title: 'What Makes Community Features Stick',
      category: 'startups',
      authorUsername: 'ameliascott',
      theme: 'Community retention',
      hook: 'Community features succeed when they give users a reason to return that feels social, visible, and personally relevant.',
      tension: 'The mistake is copying social mechanics without understanding what makes participation feel alive.',
      insight: 'Visible interaction creates momentum when it feels real and contextual.',
      takeaway: 'A platform feels active when people can see other people mattering inside it.',
    },
    {
      title: 'Clean CSS Makes Teams Faster',
      category: 'webDevelopment',
      authorUsername: 'jacksonreed',
      theme: 'CSS structure',
      hook: 'Messy styling slows teams down long before it becomes a public quality issue.',
      tension: 'The mistake is treating CSS like an afterthought instead of a system that affects confidence and change speed.',
      insight: 'Readable styles are part of maintainable product velocity.',
      takeaway: 'Clean styling patterns reduce hesitation every time the interface changes.',
    },
    {
      title: 'Why Users Notice Empty States',
      category: 'technology',
      authorUsername: 'miarussell',
      theme: 'Empty state design',
      hook: 'An empty state is often the first emotional moment inside a product because it reveals whether the system feels guided or unfinished.',
      tension: 'The mistake is leaving blank screens to carry confusion that good product writing and layout should have solved.',
      insight: 'Empty states are part instruction, part reassurance.',
      takeaway: 'A thoughtful empty state makes the product feel intentional even before the user has content.',
    },
    {
      title: 'The Mistake of Measuring Only Views',
      category: 'finance',
      authorUsername: 'danielross',
      theme: 'Analytics quality',
      hook: 'Views are easy to count, which is exactly why teams often overvalue them.',
      tension: 'The mistake is assuming that visible activity automatically reflects meaningful value.',
      insight: 'Measurement becomes misleading when it ignores depth and quality.',
      takeaway: 'Count what changes behavior, not just what looks impressive in a dashboard.',
    },
    {
      title: 'Why Publishing Beats Hoarding Drafts',
      category: 'books',
      authorUsername: 'sophiabennett',
      theme: 'Publishing discipline',
      hook: 'A draft can feel safe for too long because it preserves possibility without exposing the work to reality.',
      tension: 'The mistake is mistaking endless refinement for seriousness.',
      insight: 'Publishing creates learning that private polishing cannot.',
      takeaway: 'Ship the work while it still has the power to teach you something.',
    },
    {
      title: 'The Real Job of a Product Dashboard',
      category: 'business',
      authorUsername: 'oliviabrooks',
      theme: 'Dashboard usefulness',
      hook: 'A dashboard exists to support decisions, not merely to display data attractively.',
      tension: 'The mistake is building dashboards that look informative but do not clarify what should happen next.',
      insight: 'A dashboard is valuable when it reduces uncertainty for action.',
      takeaway: 'Show less data if it helps the right decision become more obvious.',
    },
    {
      title: 'Why APIs Should Expose Less',
      category: 'programming',
      authorUsername: 'liamturner',
      theme: 'API design',
      hook: 'Overexposed APIs create flexibility in the short term and confusion in the long term.',
      tension: 'The mistake is returning too much because it feels convenient during development.',
      insight: 'Clear boundaries make products safer and easier to reason about.',
      takeaway: 'An API should serve the product intentionally, not dump everything it knows.',
    },
    {
      title: 'Strong Products Reduce Explanation',
      category: 'technology',
      authorUsername: 'charlotteprice',
      theme: 'Product clarity',
      hook: 'When a product constantly needs long explanations to justify simple flows, the structure is usually doing too little work.',
      tension: 'The mistake is using copy to compensate for product confusion.',
      insight: 'Good structure removes the need for excess explanation.',
      takeaway: 'If users keep needing clarification, redesign the experience before rewriting the paragraph.',
    },
    {
      title: 'Why Consistency Feels Boring Before It Pays',
      category: 'productivity',
      authorUsername: 'ethanparker',
      theme: 'Consistency',
      hook: 'Consistency is frustrating early because the work arrives before the visible reward does.',
      tension: 'The mistake is interpreting delayed feedback as proof that the system is not working.',
      insight: 'The most valuable compounding period often feels unimpressive while it is happening.',
      takeaway: 'Stay long enough in the process for the evidence to catch up with the effort.',
    },
    {
      title: 'Security Habits Small Teams Ignore',
      category: 'cyberSecurity',
      authorUsername: 'henrycooper',
      theme: 'Security habits',
      hook: 'Small teams often postpone security because the threat feels abstract and the product work feels urgent.',
      tension: 'The mistake is assuming that low scale means low exposure.',
      insight: 'Basic security discipline prevents expensive avoidable damage.',
      takeaway: 'The right default today is cheaper than the right recovery later.',
    },
    {
      title: 'What Makes a Demo Feel Real',
      category: 'startups',
      authorUsername: 'masonkelly',
      theme: 'Demo quality',
      hook: 'A convincing demo is not just functional. It feels populated, coherent, and emotionally believable.',
      tension: 'The mistake is showing features in isolation without making the system feel inhabited.',
      insight: 'Realistic data changes how people judge product readiness.',
      takeaway: 'A demo feels stronger when the world inside it already looks alive.',
    },
    {
      title: 'The Best Content Systems Scale Quietly',
      category: 'softwareEngineering',
      authorUsername: 'benjaminward',
      theme: 'Content systems',
      hook: 'Strong content systems rarely draw attention to themselves because their main job is to make publishing and managing content feel dependable.',
      tension: 'The mistake is adding process complexity faster than the team actually needs it.',
      insight: 'Quiet systems often support the best operational speed.',
      takeaway: 'Scale the process in ways that preserve clarity rather than perform sophistication.',
    },
    {
      title: 'Why Visual Hierarchy Wins',
      category: 'webDevelopment',
      authorUsername: 'emmachase',
      theme: 'Visual hierarchy',
      hook: 'Most pages do not fail because they lack information. They fail because the information arrives without a clear order of importance.',
      tension: 'The mistake is asking the user to decide what matters before the design has done any of that work for them.',
      insight: 'Hierarchy is how design turns content into direction.',
      takeaway: 'When importance is obvious, interaction becomes calmer and faster.',
    },
    {
      title: 'The Difference Between Busy and Effective',
      category: 'business',
      authorUsername: 'danielross',
      theme: 'Effectiveness',
      hook: 'A full week can still produce weak results when the work keeps moving around the important thing instead of through it.',
      tension: 'The mistake is overvaluing motion because it feels safer than direct accountability.',
      insight: 'Effectiveness depends on whether the work changes reality, not how much motion it creates.',
      takeaway: 'Judge the week by meaningful outputs, not just how occupied it felt.',
    },
    {
      title: 'Healthy Work Requires Recovery',
      category: 'health',
      authorUsername: 'evelynmorris',
      theme: 'Recovery',
      hook: 'A lot of people try to improve performance by squeezing harder when the real constraint is often the absence of real recovery.',
      tension: 'The mistake is treating rest like weakness instead of part of the system that makes intensity sustainable.',
      insight: 'Recovery protects consistency more than guilt ever will.',
      takeaway: 'Better work is easier to maintain when recovery stops being optional.',
    },
    {
      title: 'Why Learning Sticks When You Teach It',
      category: 'education',
      authorUsername: 'graceadams',
      theme: 'Learning by teaching',
      hook: 'People understand ideas more deeply when they are forced to organize them clearly enough for someone else to follow.',
      tension: 'The mistake is collecting information passively and calling it learning.',
      insight: 'Explanation exposes the weak parts of your understanding quickly.',
      takeaway: 'Teach the idea, even informally, and your own understanding becomes harder to fake.',
    },
    {
      title: 'What Good Onboarding Removes',
      category: 'technology',
      authorUsername: 'avahughes',
      theme: 'Onboarding design',
      hook: 'The best onboarding does not overwhelm users with tours. It removes uncertainty from the first few meaningful steps.',
      tension: 'The mistake is teaching every feature before the user has a reason to care.',
      insight: 'Onboarding succeeds when it clears the first obstacle, not when it narrates the entire product.',
      takeaway: 'Show just enough to create movement and confidence.',
    },
    {
      title: 'Why Simple Analytics Change Behavior',
      category: 'finance',
      authorUsername: 'danielross',
      theme: 'Analytics behavior',
      hook: 'Teams often imagine better analytics as more complexity, when the biggest behavior changes usually come from a few numbers that are impossible to ignore.',
      tension: 'The mistake is building reporting that looks complete but does not reshape decisions.',
      insight: 'Useful analytics create action by making tradeoffs visible.',
      takeaway: 'A smaller metric set can be more powerful if it actually changes what the team does next.',
    },
    {
      title: 'The Problem With Over-Engineered Side Projects',
      category: 'startups',
      authorUsername: 'noahcollins',
      theme: 'Side project scope',
      hook: 'Side projects often die under the weight of structure that was added before the project earned it.',
      tension: 'The mistake is building for imagined scale before proving present usefulness.',
      insight: 'A project survives longer when its complexity matches its stage.',
      takeaway: 'Let the project become real before asking it to become grand.',
    },
    {
      title: 'Why Good Commenting Feels Human',
      category: 'lifestyle',
      authorUsername: 'sophiabennett',
      theme: 'Human conversation',
      hook: 'Good comments feel human because they respond to what was actually said instead of using the space as a stage for performance.',
      tension: 'The mistake is treating interaction like visibility instead of like conversation.',
      insight: 'People stay where the responses feel attentive rather than generic.',
      takeaway: 'A healthy comment culture is built through tone, defaults, and visible examples.',
    },
    {
      title: 'Building a Site That Feels Alive',
      category: 'technology',
      authorUsername: 'ethanparker',
      theme: 'Living product experience',
      hook: 'A site feels alive when users can immediately see identity, motion, response, and signs that other people meaningfully exist inside the system.',
      tension: 'The mistake is launching features without enough relational data to make the product feel inhabited.',
      insight: 'Activity needs context to feel real.',
      takeaway: 'A believable product world makes every feature feel stronger because the system stops looking empty.',
    },
  ];

  
  const posts = [];
  const postsById = {};
  const postHistoryRows = [];
  const reportsRows = [];
  const bookmarkRows = [];
  const notificationRows = [...followNotifications];
  const allComments = [];

  for (let i = 0; i < postSpecs.length; i++) {
    const spec = postSpecs[i];
    const author = usersByUsername[spec.authorUsername];

    const post = await prisma.post.create({
      data: {
        title: spec.title,
        content: buildRichTextArticle(spec),
        category: spec.category,
        picture: `https://picsum.photos/seed/${slugify(spec.title)}/1200/700`,
        authorId: author.id,
        published: true,
        views: 120 + i * 17 + (i % 5) * 23,
        createdAt: daysAgo(55 - i, 9 + (i % 8), 0),
      },
    });

    posts.push(post);
    postsById[post.id] = post;

    postHistoryRows.push({
      title: spec.title,
      content: `
        <h1>${spec.title}</h1>
        <p>Earlier draft version of this article.</p>
        <p>${spec.hook}</p>
        <p>${spec.insight}</p>
      `.replace(/\n\s+/g, '').trim(),
      category: spec.category,
      picture: post.picture,
      postId: post.id,
      authorId: author.id,
      createdAt: daysAgo(56 - i, 8 + (i % 7), 0),
    });

   
    const bookmarkCount = i % 2 === 0 ? 3 : 4;
    const bookmarkCandidates = regularUsers.filter((u) => u.id !== author.id);
    for (let b = 0; b < bookmarkCount; b++) {
      const bookmarkUser = bookmarkCandidates[(i + b * 2) % bookmarkCandidates.length];
      bookmarkRows.push({
        userId: bookmarkUser.id,
        postId: post.id,
        createdAt: daysAgo(54 - i, 14 + (b % 4), 0),
      });
    }

    
    if (i % 7 === 0) {
      const reporter = regularUsers[(i + 4) % regularUsers.length];
      reportsRows.push({
        reporterId: reporter.id,
        postId: post.id,
        reason: 'Flagged for moderation review during demo data setup.',
        type: 'POST',
        status: i % 14 === 0 ? 'OPEN' : 'RESOLVED',
        createdAt: daysAgo(20 - (i % 10), 16, 0),
      });
    }
  }

  await prisma.postHistory.createMany({
    data: postHistoryRows,
  });

  
  const draftsData = [
    {
      title: 'Why Friction Shapes Behavior More Than Motivation',
      topic: 'how friction quietly changes everyday execution',
      lesson: 'The next version should explain how small environmental changes alter what feels easy enough to repeat.',
      authorUsername: 'ethanparker',
      category: 'productivity',
    },
    {
      title: 'The Pages Users Trust Fastest',
      topic: 'the design patterns that signal credibility quickly',
      lesson: 'The article should compare profile pages, dashboards, and settings flows as trust-building surfaces.',
      authorUsername: 'oliviabrooks',
      category: 'webDevelopment',
    },
    {
      title: 'Where Simple APIs Outperform Flexible Ones',
      topic: 'why deliberate boundaries create stronger systems',
      lesson: 'The next version should show how overexposed endpoints increase long-term confusion.',
      authorUsername: 'liamturner',
      category: 'programming',
    },
    {
      title: 'Publishing on a Weekly Rhythm',
      topic: 'how steady publishing sharpens thinking',
      lesson: 'The draft should connect consistency to voice, not only to output volume.',
      authorUsername: 'sophiabennett',
      category: 'career',
    },
    {
      title: 'What Makes Empty Products Feel Dead',
      topic: 'why demos need social context and realistic activity',
      lesson: 'The final version should include examples from feed products, profiles, and notifications.',
      authorUsername: 'masonkelly',
      category: 'startups',
    },
    {
      title: 'How Recovery Protects Serious Work',
      topic: 'the link between recovery and sustainable output',
      lesson: 'This should become a more practical piece with scheduling examples and reset rituals.',
      authorUsername: 'evelynmorris',
      category: 'health',
    },
    {
      title: 'Teaching as a Learning System',
      topic: 'how explanation reveals gaps in understanding',
      lesson: 'The next version should include a repeatable teaching loop students can apply each week.',
      authorUsername: 'graceadams',
      category: 'education',
    },
    {
      title: 'Why Communities Need Visible Signals of Care',
      topic: 'how thoughtful interaction patterns shape the feel of a platform',
      lesson: 'This draft should later include examples from comments, follows, and moderation.',
      authorUsername: 'ameliascott',
      category: 'technology',
    },
  ];

  await prisma.draft.createMany({
    data: draftsData.map((draft, index) => ({
      title: draft.title,
      content: buildDraftHtml(draft.title, draft.topic, draft.lesson),
      category: draft.category,
      picture: `https://picsum.photos/seed/${slugify(draft.title)}/1200/700`,
      authorId: usersByUsername[draft.authorUsername].id,
      createdAt: daysAgo(18 - index, 10 + (index % 6), 0),
    })),
  });

 
  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    const spec = postSpecs[i];
    const author = usersByUsername[spec.authorUsername];

    const commentCount = i % 2 === 0 ? 6 : 7;
    const commenters = regularUsers.filter((u) => u.id !== author.id);

    const postComments = [];

    for (let c = 0; c < commentCount; c++) {
      const commenter = commenters[(i + c * 2) % commenters.length];

      const comment = await prisma.comment.create({
        data: {
          content: buildComment(spec, c),
          authorId: commenter.id,
          postId: post.id,
          createdAt: daysAgo(50 - i, 12 + (c % 7), 0),
        },
      });

      postComments.push(comment);
      allComments.push(comment);

      notificationRows.push({
        userId: author.id,
        actorId: commenter.id,
        type: 'comment',
        postId: post.id,
        commentId: comment.id,
        isRead: c % 3 === 0,
        createdAt: comment.createdAt,
      });
    }

    // 2 replies by default, 3 on every 3rd post
    const replyCount = i % 3 === 0 ? 3 : 2;
    for (let r = 0; r < replyCount; r++) {
      const targetComment = postComments[r];
      const replier =
        r === 0
          ? author
          : commenters[(i + r + 5) % commenters.length];

      const reply = await prisma.reply.create({
        data: {
          content: buildReply(spec, r),
          authorId: replier.id,
          commentId: targetComment.id,
          createdAt: daysAgo(49 - i, 15 + r, 0),
        },
      });

     
      if (replier.id !== targetComment.authorId) {
        notificationRows.push({
          userId: targetComment.authorId,
          actorId: replier.id,
          type: 'reply',
          commentId: targetComment.id,
          isRead: r % 2 === 0,
          createdAt: reply.createdAt,
        });
      }
    }
  }

  
  for (let i = 0; i < allComments.length; i += 19) {
    const comment = allComments[i];
    const reporter = regularUsers[(i + 3) % regularUsers.length];

    reportsRows.push({
      reporterId: reporter.id,
      commentId: comment.id,
      reason: 'Comment flagged for moderation review during demo setup.',
      type: 'COMMENT',
      status: i % 38 === 0 ? 'OPEN' : 'RESOLVED',
      createdAt: daysAgo(9 - (i % 5), 18, 0),
    });
  }


  const uniqueBookmarkMap = new Map();
  for (const row of bookmarkRows) {
    const key = `${row.userId}-${row.postId}`;
    if (!uniqueBookmarkMap.has(key)) {
      uniqueBookmarkMap.set(key, row);
    }
  }

  await prisma.bookmark.createMany({
    data: [...uniqueBookmarkMap.values()],
    skipDuplicates: true,
  });

  await prisma.notification.createMany({
    data: notificationRows,
  });

  await prisma.report.createMany({
    data: reportsRows,
  });

  console.log('Seed completed successfully.');
  console.log('Admin: admin / DemoPass123!');
  console.log('Demo user: ethanparker / DemoPass123!');
  console.log(`Users created: ${usersData.length}`);
  console.log(`Posts created: ${posts.length}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });