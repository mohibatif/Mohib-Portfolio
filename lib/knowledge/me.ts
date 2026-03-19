// Personal knowledge base — fill this in with YOUR info
export const ME = {
    name: "Mohib Atif",
    role: "Designer & Builder",
    tagline: "I build things that matter.",
    age: 21,
    birthDate: "July 30, 2004",
    interests: ["Designing", "Sketching", "Photography", "Travelling"],
    travelContext: {
        countriesVisitedCount: 10,
        countries: [
            "Pakistan", "UAE", "France", "Turkey", "Saudi Arabia",
            "Singapore", "Italy", "Switzerland", "Azerbaijan", "Georgia"
        ],
    },
    bio: `Designing the Future
Artificial Intelligence Student and Graphic Design Enthusiast. I specialize in print media, social media design, and posters through my Design Studio, Shrewd.
Currently, I'm building Aura (a smart notes app that uses mindmaps) and a bulk certificate generation/verification system. I'm also constantly iterating on this portfolio.
Currently in my 6th semester of studying Artificial Intelligence at the University of Management and Technology.`,

    experience: [
        {
            company: "Stanford University",
            role: "Code in Place Student",
            period: "Apr 2025 – Jun 2025",
            description: "Successfully completed Stanford's 'Code in Place' programming course, taught by Chris Piech and Mehran Sahami.",
        },
        {
            company: "Google Developer Groups on Campus - UMT",
            role: "Campus Lead",
            period: "2023 – Present",
            description: "Leading the GDG chapter at UMT, organizing workshops, hackathons, and tech talks to grow the developer community on campus. Previously served as Design Lead and Campus Co-Lead.",
        },
        {
            company: "Surge UMT",
            role: "Vice President",
            period: "2024 – Present",
            description: "Heading Surge, UMT's flagship tech society, driving initiatives in AI, design, and entrepreneurship. Also serve as Design Lead.",
        },
        {
            company: "Devsinc",
            role: "Ambassador",
            period: "2025 – Present",
            description: "Representing Devsinc at university level, connecting students with internship and career opportunities in software development.",
        },
    ],
    updates: [
        {
            name: "Stanford Code in Place 2025",
            description: "Excited to share I’ve been officially accepted into Stanford University's Code in Place 2025 program.",
            url: "https://www.linkedin.com/feed/update/urn:li:activity:7318574161935630336/",
            imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQH83k7000Bwww/feedshare-shrink_2048_1536/B4DZZDMafnHAAs-/0/1744884051667?e=2147483647&v=beta&t=Tr60laCnwDOM-XygsgqF28Lbdu6FHkiICrA90YEmK4E",
        },
        {
            name: "Lead | Google Developer Group UMT",
            description: "Here we go, the next chapter of my Google Developers Group on Campus UMT journey.",
            url: "https://www.linkedin.com/feed/update/urn:li:activity:7384102314048999424/",
            imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQHda9CTnmHC0w/feedshare-shrink_800/B4DZnmZ4HYIgAg-/0/1760507179589?e=2147483647&v=beta&t=LMIJ5X9TDpjwc1VLOKVxUdn_d_HRP0-6Iu4TrjwOK04",
        },
        {
            name: "Devsinc Ambassador",
            description: "Journey from a volunteer to an ambassador. Representing University of Management and Technology - UMT as a Devsinc Ambassador.",
            url: "https://www.linkedin.com/feed/update/urn:li:activity:7308012683994259458/",
            imageUrl: "https://media.licdn.com/dms/image/v2/D4D22AQEuzPaOMxVF6g/feedshare-shrink_2048_1536/B4DZWtGwODHAAs-/0/1742365998989?e=2147483647&v=beta&t=RC-HdgY3O72zTyh3haCAhIZS-K8vdphYisJ_EjJN3eo",
        },
        {
            name: "Softcom'26 X GIKI Hackathon Winners",
            description: "Secured first place in both Game Development and Design categories at the prestigious Softcom '26 X GIKI Hackathon.",
            url: "https://www.linkedin.com/posts/iamohib_softcom26-giki-hackathon-winners-activity-7309482136120582144-vytU", // Updated with provided content
            imageUrl: "/giki.jpeg",
        },
    ],

    skills: [
        "Artificial Intelligence", "Graphic Design (Print, Social Media, Posters)", "Figma", "React", "Next.js",
        "Python", "Machine Learning", "TypeScript", "Three.js", "Node.js",
        "Prompt Engineering", "Product Design", "AWS", "Docker", "Blender",
    ],

    education: {
        school: "University of Management and Technology",
        degree: "Bachelor of Artificial Intelligence",
        semester: "6th",
        year: "2027",
    },

    social: {
        github: "https://github.com/mohibatif",
        linkedin: "https://www.linkedin.com/in/iamohib/",
        behance: "https://www.behance.net/IAMOHIB",
        email: "mohibatif9@gmail.com",
    },
    tools: {
        code: [
            { name: "Antigravity", icon: "/logos/tools/antigravity.svg" },
            { name: "Claude", icon: "/logos/tools/claude.svg" },
            { name: "Gemini", icon: "/logos/tools/gemini.svg" },
        ],
        design: [
            { name: "Figma", icon: "/logos/tools/figma.svg" },
            { name: "Illustrator", icon: "/logos/tools/illustrator.svg" },
            { name: "Photoshop", icon: "/logos/tools/photoshop.svg" },
        ],
    },
};

// Chunked knowledge for RAG
export function buildKnowledgeChunks(): string[] {
    const chunks: string[] = [];

    chunks.push(
        `I am ${ME.name}, a ${ME.role}. I am ${ME.age} years old, born on ${ME.birthDate}. ${ME.bio}`
    );

    chunks.push(
        `I love ${ME.interests.join(", ")}. I have travelled to ${ME.travelContext.countriesVisitedCount} countries including ${ME.travelContext.countries.join(", ")}.`
    );

    chunks.push(
        `My education: ${ME.education.degree} at ${ME.education.school}, graduating ${ME.education.year}.`
    );

    chunks.push(
        `My technical skills include: ${ME.skills.join(", ")}.`
    );

    ME.experience.forEach((exp) => {
        chunks.push(
            `Work experience at ${exp.company} as ${exp.role} (${exp.period}): ${exp.description}`
        );
    });

    ME.updates.forEach((update) => {
        chunks.push(
            `Update: ${update.name}. ${update.description} Link: ${update.url}`
        );
    });

    chunks.push(
        `You can find me on GitHub at ${ME.social.github}, LinkedIn at ${ME.social.linkedin}, and Behance at ${ME.social.behance}. Email: ${ME.social.email}`
    );

    chunks.push(
        `I am currently working on: 
        1. Aura: A smart notes app that doesn't require writing and includes mindmaps.
        2. A bulk certificate generation and verification app.
        3. Improving this portfolio.
        4. Design projects for my Design Studio, Shrewd.
        5. What AI means to me: Well AI for me has two meaning Artificial Intelligence & Adobe Illustrator I can't live without em :D`
    );

    return chunks;
}
