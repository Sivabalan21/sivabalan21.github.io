export const site = {
  name: 'Siva Balan Saravanan',
  shortName: 'Siva Balan',
  title: 'Siva Balan',
  description:
    'Siva Balan, software engineer. Three years building production backend systems for debt collection software at Ezee.ai, now an MS CS student at NYU Courant. Backend and distributed systems, applied AI and ML, and systems work.',
  email: 'sivabalan212k@gmail.com',
  github: 'https://github.com/sivabalan21',
  linkedin: 'https://www.linkedin.com/in/siva-balan-063581189',
  resume: '/resume.pdf',
};

// Each number is tied to the scope it actually describes.
export const scopes = [
  {
    scope: 'Across the platform',
    items: [
      { value: '~200', label: 'REST APIs across the systems I worked on' },
      { value: '~25', label: 'financial institutions as clients' },
      { value: '30+', label: 'production incidents resolved' },
    ],
  },
  {
    scope: 'Performance Management Platform',
    items: [
      { value: '18', label: 'REST APIs in this module, plus 2 batch pipelines' },
      { value: '10M+', label: 'loan accounts scored' },
      { value: '180 → 20 min', label: 'batch pipeline runtime' },
    ],
  },
  {
    scope: 'Access management service',
    items: [{ value: '~50', label: 'APIs, JWT and RBAC' }],
  },
];

// Skills: what I work with. Sources: resume, profile document, projects.
// `icon` keys map to src/data/toolIcons.ts; items without one render as text.
export const skillGroups: { group: string; items: { name: string; icon?: string }[] }[] = [
  { group: 'Languages', items: [
    { name: 'Python', icon: 'python' }, { name: 'C++', icon: 'cplusplus' }, { name: 'C', icon: 'c' },
    { name: 'Java', icon: 'java' }, { name: 'JavaScript', icon: 'javascript' }, { name: 'TypeScript', icon: 'typescript' },
    { name: 'SQL' }, { name: 'CUDA', icon: 'nvidia' },
  ] },
  { group: 'Backend and web', items: [
    { name: 'Node.js', icon: 'nodejs' }, { name: 'Express', icon: 'express' }, { name: 'REST APIs' },
    { name: 'GraphQL', icon: 'graphql' }, { name: 'Microservices' }, { name: 'JWT', icon: 'jwt' },
    { name: 'RBAC' }, { name: 'React', icon: 'react' }, { name: 'Angular', icon: 'angular' }, { name: 'Jest', icon: 'jest' },
  ] },
  { group: 'Distributed systems', items: [
    { name: 'Kafka', icon: 'kafka' }, { name: 'RabbitMQ', icon: 'rabbitmq' }, { name: 'Redis', icon: 'redis' },
    { name: 'Apache ZooKeeper', icon: 'apache' }, { name: 'Ray', icon: 'ray' }, { name: 'Event-driven architecture' },
  ] },
  { group: 'Data', items: [
    { name: 'Spark', icon: 'spark' }, { name: 'Hadoop', icon: 'hadoop' }, { name: 'Hive', icon: 'hive' },
    { name: 'GraphFrames' },
  ] },
  { group: 'Databases', items: [
    { name: 'MongoDB', icon: 'mongodb' }, { name: 'PostgreSQL', icon: 'postgresql' }, { name: 'MySQL', icon: 'mysql' },
    { name: 'pgvector' },
  ] },
  { group: 'AI and ML', items: [
    { name: 'PyTorch', icon: 'pytorch' }, { name: 'TensorFlow', icon: 'tensorflow' }, { name: 'Spark MLlib', icon: 'spark' },
    { name: 'Hugging Face', icon: 'huggingface' }, { name: 'LangChain', icon: 'langchain' }, { name: 'LangGraph', icon: 'langgraph' },
    { name: 'RAG' }, { name: 'Semantic and hybrid search' }, { name: 'SFT and GRPO' },
  ] },
  { group: 'Systems and performance', items: [
    { name: 'Triton' }, { name: 'CUTLASS' }, { name: 'FlashAttention' }, { name: 'torch.compile' },
    { name: 'H100 and A100 GPUs', icon: 'nvidia' }, { name: 'GPU profiling' }, { name: 'Windows kernel drivers' },
  ] },
];
// Flat version for places that list skills as text.
export const skills = skillGroups.map((g) => ({ group: g.group, items: g.items.map((i) => i.name) }));

// Tools: the environments and platforms in the day-to-day workflow (distinct from Skills).
// `icon` keys map to src/data/toolIcons.ts.
export const toolGroups = [
  {
    group: 'Development',
    tools: [
      { name: 'Git and GitHub', icon: 'github', what: 'Version control, branches, and pull requests' },
      { name: 'VS Code', icon: 'vscode', what: 'Main editor' },
      { name: 'Claude Code and Cursor', icon: 'claude', what: 'AI-assisted coding, debugging, and reading unfamiliar code' },
      { name: 'Linux', icon: 'linux', what: 'Development servers and GPU machines' },
      { name: 'Postman', icon: 'postman', what: 'Building and testing REST APIs' },
    ],
  },
  {
    group: 'Cloud and DevOps',
    tools: [
      { name: 'AWS', icon: 'aws', what: 'Production services at Ezee.ai, and RDS for the Elective Management System' },
      { name: 'GCP', icon: 'googlecloud', what: 'Hosting for the Elective Management System' },
      { name: 'Docker', icon: 'docker', what: 'Containerized services and reproducible environments' },
      { name: 'Jenkins', icon: 'jenkins', what: 'CI/CD pipelines' },
      { name: 'GitLab', icon: 'gitlab', what: 'Source control and CI/CD with Jenkins' },
    ],
  },
  {
    group: 'Data and ML',
    tools: [
      { name: 'Tableau', icon: 'tableau', what: 'Dashboards and data visualization' },
      { name: 'Slurm', icon: 'slurm', what: 'Scheduling GPU training jobs on shared clusters' },
      { name: 'Ollama', icon: 'ollama', what: 'Running LLMs locally' },
    ],
  },
  {
    group: 'Planning',
    tools: [
      { name: 'Jira', icon: 'jira', what: 'Sprint planning, stand-ups, and issue tracking' },
    ],
  },
];

// Exact names from the resume.
export const certifications = {
  completed: [
    { name: 'AWS Cloud Practitioner', detail: 'Score 943/1000' },
    { name: 'GCP Fundamentals: Services, Infrastructure, Security, ML', detail: '' },
    { name: 'MongoDB: Optimizations and Performance', detail: '' },
    { name: 'MTA Introduction to Programming using Python', detail: 'Score 90%' },
  ],
  next: ['AWS Solutions Architect Associate', 'Google Professional Machine Learning Engineer'],
};

export const education = {
  amrita: {
    school: 'Amrita Vishwa Vidyapeetham',
    campus: 'Amrita School of Engineering, Coimbatore, India',
    degree: 'B.Tech in Computer Science and Engineering',
    dates: 'Jul 2018 – Jun 2022',
    // Exact course names from the transcript, grouped.
    highlights: [
      { text: 'Top 3 Project Award for the Elective Management System', href: '/projects/elective-management-system' },
      { text: 'Behavioural Analysis of Ransomwares: a Windows kernel minifilter in C++', href: '/projects/ransomware' },
      { text: 'Competitive programming, CodeChef 4★ (max 1801)', href: '/achievements' },
    ],
    featured: ['Data Structures and Algorithms', 'Operating Systems', 'Database Management Systems', 'Computer Networks', 'Compiler Design', 'Theory of Computation'],
    groups: [
      { area: 'Algorithms and theory', courses: ['Data Structures and Algorithms', 'Design and Analysis of Algorithms', 'Advanced Algorithms and Analysis', 'Discrete Mathematics', 'Theory of Computation', 'Probability and Random Processes', 'Linear Algebra, Queueing Theory and Optimization'] },
      { area: 'Systems', courses: ['Operating Systems', 'Computer Organization and Architecture', 'Computer Networks', 'Compiler Design', 'Database Management Systems', 'Digital Circuits and Systems', 'Embedded Systems', 'Internet of Things'] },
      { area: 'Software', courses: ['Object Oriented Programming', 'Structure and Interpretation of Computer Programs', 'Software Engineering', 'Software Project Management', 'Service-Oriented Architecture', 'Net Centric Programming', 'Cloud Computing and Services'] },
      { area: 'AI and data', courses: ['Principles of Machine Learning', 'Machine Learning and Data Mining', 'Computational Intelligence'] },
    ],
  },
  nyu: {
    school: 'New York University',
    campus: 'Courant Institute of Mathematical Sciences, New York',
    degree: 'MS in Computer Science',
    dates: 'Sep 2025 – May 2027 (expected)',
    expected: 'May 2027',
    gpa: '3.67',
    highlights: [
      { text: 'FlashAttention-3 kernels on H100 and an LLM built from scratch', href: '/projects/flashattention-3' },
      { text: 'Distributed recommendation platform on Spark, Kafka, and Ray', href: '/projects/recommendation-platform' },
      { text: 'Finalist at the Columbia AI for Good Hackathon with HealthcareAI', href: '/projects/healthcareai' },
      { text: 'Represented NYU at the ICPC Greater New York Regional', href: '/achievements' },
    ],
    groups: [
      { area: 'Algorithms and languages', courses: ['Fundamental Algorithms', 'Programming Languages'] },
      { area: 'Systems', courses: ['Operating Systems', 'GPU Programming and Architecture', 'Realtime Big Data Analytics', 'Big Data Application Development'] },
      { area: 'Machine learning', courses: ['Machine Learning', 'Building LLM Reasoners'] },
      { area: 'Finance', courses: ['Technologies for Finance'] },
    ],
  },
};

export const achievements = [
  {
    stage: 'NYU',
    items: [
      { date: 'Feb 2026', title: 'Finalist, Columbia AI for Good Hackathon', context: 'Finalist among 40 teams with HealthcareAI, an AI-assisted clinical platform covering 13 workflows.', href: '/projects/healthcareai', linkLabel: 'HealthcareAI project' },
      { date: 'Oct 2025', title: 'Represented NYU at the ICPC North America Greater New York Regional', context: 'Competed at Columbia University as NYU Team 3, with teammates Nilarnab and Mayank.' },
    ],
  },
  {
    stage: 'Ezee.ai',
    items: [
      { date: 'May 2025', title: 'Won the Ezee.ai AI Hackathon', context: 'Built an LLM-powered workflow generator using RAG.' },
      { date: 'Jan 2025', title: 'Innovation Instigator Award, Ezee.ai', context: 'Recognized for architectural design, feature ownership, and performance optimization.', href: '/experience#pipeline', linkLabel: 'Performance work at Ezee.ai' },
    ],
  },
  {
    stage: 'Amrita',
    items: [
      { date: '2021', title: 'Top 3 Project Award, Amrita School of Engineering', context: 'For the Elective Management System, built by a team of five. I was full stack developer, DevOps engineer, and Scrum Master.', href: '/projects/elective-management-system', linkLabel: 'Elective Management System' },
      { date: '2018 – now', title: 'CodeChef 4★, max rating 1801', context: 'Competitive programming since undergrad, including topping CodeChef contests. Still active on Codeforces and LeetCode.' },
    ],
  },
];

export const highlights = [
  { date: '2026', text: 'Finalist among 40 teams, Columbia AI for Good Hackathon' },
  { date: '2025', text: 'Represented NYU at the ICPC Greater New York Regional' },
  { date: '2025', text: 'Won the Ezee.ai AI Hackathon' },
  { date: '2025', text: 'Innovation Instigator Award, Ezee.ai' },
  { date: '2021', text: 'Top 3 Project Award, Elective Management System' },
  { date: 'Ongoing', text: 'CodeChef 4★, max rating 1801' },
];

export const noteThemes = ['Databases in practice', 'Batch processing', 'Storage and coordination', 'Logs and streams', 'The Spark stack', 'Machine learning'] as const;
