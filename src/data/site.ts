export const site = {
  name: 'Siva Balan Saravanan',
  shortName: 'Siva Balan',
  title: 'Siva Balan — Software Engineer',
  description:
    'Siva Balan: software engineer with 3+ years building production backend systems, now an MS CS student at NYU Courant. Backend and distributed systems, applied AI, ML systems, and GPU performance.',
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
      { value: '18', label: 'REST APIs and 2 batch pipelines' },
      { value: '10M+', label: 'loan accounts scored' },
      { value: '180 → 20 min', label: 'batch pipeline runtime' },
    ],
  },
  {
    scope: 'Access management service',
    items: [{ value: '~50', label: 'APIs, JWT and RBAC' }],
  },
];

export const skills = [
  { group: 'Software engineering', items: ['Python', 'C++', 'C', 'Java', 'JavaScript', 'SQL', 'Node.js', 'Express', 'REST', 'GraphQL', 'Microservices', 'JWT', 'RBAC'] },
  { group: 'Distributed systems', items: ['Kafka', 'RabbitMQ', 'Redis', 'Ray'] },
  { group: 'Data', items: ['Spark', 'Hadoop', 'Hive', 'Tableau'] },
  { group: 'Databases', items: ['MongoDB', 'PostgreSQL', 'MySQL', 'pgvector'] },
  { group: 'AI and ML', items: ['PyTorch', 'RAG', 'Semantic and hybrid search', 'LangChain', 'LangGraph', 'Spark MLlib'] },
  { group: 'Systems and performance', items: ['CUDA', 'Triton', 'CUTLASS', 'FlashAttention', 'H100 and A100 GPUs', 'Slurm'] },
];

// Tools: the environments and platforms in the day-to-day workflow (distinct from Skills).
export const tools = [
  { name: 'Git and GitHub', what: 'Version control, branches, and pull requests' },
  { name: 'VS Code', what: 'Main editor' },
  { name: 'Claude Code and Cursor', what: 'AI-assisted coding, debugging, and reading unfamiliar code' },
  { name: 'Linux', what: 'Development servers and GPU machines' },
  { name: 'Slurm', what: 'Scheduling GPU training jobs on shared clusters' },
  { name: 'Docker', what: 'Containerized services and reproducible environments' },
  { name: 'Jenkins', what: 'CI/CD builds and deployments' },
  { name: 'AWS', what: 'Cloud infrastructure for production services' },
  { name: 'GCP', what: 'Cloud platform' },
  { name: 'Postman', what: 'Building and testing REST APIs' },
  { name: 'Jira', what: 'Sprint planning and issue tracking' },
  { name: 'Tableau', what: 'Dashboards and data visualization' },
  { name: 'Ollama', what: 'Running LLMs locally' },
];

export const education = {
  amrita: {
    school: 'Amrita Vishwa Vidyapeetham',
    campus: 'Amrita School of Engineering, Coimbatore, India',
    degree: 'B.Tech in Computer Science and Engineering',
    dates: 'Jul 2018 – Jun 2022',
    // Exact course names from the transcript, grouped.
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
    gpa: '3.67',
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
      { date: 'May 2025', title: 'Won the Ezee.ai AI Hackathon', context: 'Built an LLM-powered lending workflow generator using RAG.' },
      { date: 'Jan 2025', title: 'Innovation Instigator Award, Ezee.ai', context: 'Recognized for architectural design, feature ownership, and performance optimization.', href: '/experience#pipeline', linkLabel: 'Performance work at Ezee.ai' },
    ],
  },
  {
    stage: 'Competitive programming',
    items: [
      { date: '2018 – now', title: 'CodeChef 4★, max rating 1801', context: 'Competitive programming since undergrad, including topping CodeChef contests. Still active on Codeforces and LeetCode.' },
    ],
  },
];

export const highlights = [
  { date: '2026', text: 'Finalist among 40 teams, Columbia AI for Good Hackathon' },
  { date: '2025', text: 'Represented NYU at the ICPC Greater New York Regional' },
  { date: '2025', text: 'Won the Ezee.ai AI Hackathon' },
  { date: '2025', text: 'Innovation Instigator Award, Ezee.ai' },
  { date: 'Ongoing', text: 'CodeChef 4★, max rating 1801' },
];

export const noteThemes = ['Batch processing', 'Storage and coordination', 'Logs and streams', 'The Spark stack'] as const;
