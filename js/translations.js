/* =========================================================
   All visible text of the site, in French and English.
   - Edit a value here and it changes on the page.
   - Keys must exist in both "fr" and "en".
   - Values may contain simple HTML (<em>, <br>, <span class="glow">).
   - Lines marked TODO are placeholders: replace with the club's real info.
   ========================================================= */
window.I18N = {
  fr: {
    /* ---- Meta & accessibility ---- */
    "meta.title.home": "AI INNOVATORS · IA & Nature",
    "meta.desc.home": "AI INNOVATORS, le club d’intelligence artificielle des étudiants. Thème 2026–27 : IA & Nature. Projets, ateliers, certifications. Inscriptions ouvertes.",
    "meta.title.register": "Inscription · AI INNOVATORS",
    "meta.desc.register": "Rejoins AI INNOVATORS : adhésion gratuite, ouverte à tous les étudiants.",
    "a11y.skip": "Aller au contenu",
    "a11y.menu": "Menu",
    "a11y.lang": "Langue",

    /* ---- Navigation ---- */
    "nav.about": "Le club",
    "nav.program": "Programme",
    "nav.activities": "Projets",
    "nav.register": "S’inscrire",
    "nav.back": "Retour au site",

    /* ---- Hero ---- */
    "hero.eyebrow": "Thème 2026–27 · IA & Nature",
    "hero.title": "Là où l’intelligence<br>prend <span class=\"glow\">racine</span>",
    "hero.lead": "AI INNOVATORS est le club d’IA des étudiants. Cette année, on met l’IA au service des oliviers, des plages et de la biodiversité tunisienne, avec de vrais projets dès le premier jour.",
    "hero.cta": "Rejoindre le club",
    "hero.secondary": "Voir le programme",
    "hero.note": "Inscriptions ouvertes · gratuit · tous niveaux",
    "hero.scroll": "défiler",

    /* ---- About ---- */
    "about.eyebrow": "01 · Le club",
    "about.h1": "Des étudiants qui <em>construisent</em>.",
    "about.p1": "AI INNOVATORS réunit des étudiants de toutes les filières (informatique, biologie, ingénierie, design) qui veulent comprendre l’intelligence artificielle en la fabriquant. Pas besoin d’être expert : il suffit d’être curieux.",
    "about.h2": "Une nature qui <em>inspire</em>.",
    "about.p2": "Les réseaux de neurones imitent le cerveau, les algorithmes génétiques imitent l’évolution. Cette année, on remonte à la source : la nature comme modèle, comme donnée, et comme cause à défendre.",
    "about.stats": [
      { value: "5", label: "projets IA & Nature" },
      { value: "3+", label: "certifications visées" },
      { value: "0", label: "matériel requis" },
      { value: "120+", label: "membres" } // TODO: vrai nombre de membres
    ],

    /* ---- Theme story (scroll animation) ---- */
    "story.label": "Pourquoi IA & Nature ?",
    "story.cap1": "Une nervure transporte la sève.",
    "story.cap2": "Un réseau transporte l’information.",
    "story.cap3": "La nature a inventé le réseau bien avant nous. Cette année, on apprend d’elle et on travaille pour elle.",

    /* ---- Values ---- */
    "values.eyebrow": "Nos valeurs",
    "values.title": "Trois racines qui nous <em>tiennent</em>.",
    "values.list": [
      { text: "Apprendre en construisant : chaque idée finit en prototype, même imparfait." },
      { text: "Ouvert à tous : dans une forêt, chaque espèce a sa place. Chaque filière et chaque niveau aussi." },
      { text: "Une IA responsable, sobre en énergie et utile au vivant. Jamais l’inverse." }
    ],

    /* ---- Program ---- */
    "program.eyebrow": "02 · Le programme",
    "program.title": "Une année en quatre <em>saisons</em>.",
    "program.lead": "Du premier projet au showcase final, l’année suit le rythme de la nature : on sème, on s’enracine, on fleurit, puis on récolte.",
    // TODO: ajuster les mois au calendrier réel
    "program.seasons": [
      {
        season: "Automne", months: "Oct. à Nov.", title: "Semer les graines",
        text: "Lancement du club et premier projet, pensé pour les débutants.",
        points: ["Soirée de lancement", "AI Nature Detective", "Concours : l’IA peut-elle identifier la biodiversité tunisienne ?"]
      },
      {
        season: "Hiver", months: "Déc. à Fév.", title: "Faire pousser les racines",
        text: "Deux projets en équipes mixtes : chacun son rôle, pas besoin d’être expert en IA.",
        points: ["Plant Doctor", "AI Waste Classifier", "Préparation aux certifications"]
      },
      {
        season: "Printemps", months: "Mars à Avr.", title: "La floraison",
        text: "Direction le terrain : photos des plages et atelier ville durable.",
        points: ["AI Beach Pollution Detector", "Collecte de photos sur les plages", "Atelier AI Green City"]
      },
      {
        season: "Été", months: "Mai à Juin", title: "La récolte",
        text: "On présente nos projets et on célèbre les certifications obtenues.",
        points: ["Showcase des projets", "Remise des certificats", "Élection du nouveau bureau"]
      }
    ],

    /* ---- Projects (from activities.md). Icons: i-detective, i-doctor, i-wave, i-recycle, i-city ---- */
    "projects.eyebrow": "03 · Les projets",
    "projects.title": "Cinq projets, <em>zéro capteur</em>.",
    "projects.lead": "Un ordinateur et une connexion suffisent. Front-end, intégration IA, UX/UI, données, recherche ou tests : chacun trouve son rôle.",
    "projects.items": [
      { icon: "#i-detective", level: "Idéal pour débuter", title: "AI Nature Detective", text: "Une photo de nature : l’IA identifie l’espèce, son rôle et un fait surprenant.", input: "Photo", output: ["Olivier", "Plante", "94 %"] },
      { icon: "#i-doctor", level: "Accessible", title: "Plant Doctor", text: "L’IA examine une feuille, détecte carences ou maladies et explique quoi faire.", input: "Feuille", output: ["Saine", "Carence", "Champignon"] },
      { icon: "#i-wave", level: "Fort impact", title: "AI Beach Pollution Detector", text: "L’IA compte les déchets sur une photo de plage et calcule un score de pollution.", input: "Plage", output: ["12 bouteilles", "7 sacs", "Score 68/100"] },
      { icon: "#i-recycle", level: "Facile", title: "AI Waste Classifier", text: "L’IA reconnaît un déchet et indique la bonne poubelle. Version Arduino en option.", input: "Déchet", output: ["Plastique", "Recyclable", "Bac plastique"] },
      { icon: "#i-city", level: "Atelier", title: "AI Green City", text: "On décrit une ville, l’IA propose un plan plus vert et le visualise.", input: "Ville", output: ["Espaces verts", "Pistes cyclables", "Solaire"] }
    ],
    "certs.title": "Certifications IA & automatisation",
    "certs.text": "On s’y prépare ensemble, à ton rythme.",
    "certs.items": [{ name: "Anthropic" }, { name: "AWS" }, { name: "Microsoft" }, { name: "et d’autres" }],

    /* ---- Join CTA ---- */
    "join.eyebrow": "Inscriptions ouvertes",
    "join.title": "Fais partie de la <em>prochaine pousse</em>.",
    "join.lead": "L’adhésion est gratuite et ouverte à tous les étudiants, quel que soit ton niveau. Deux minutes pour t’inscrire, une année pour grandir.",
    "join.cta": "S’inscrire maintenant",
    "join.notes": [{ text: "Gratuit" }, { text: "Toutes filières" }, { text: "Débutants bienvenus" }],

    /* ---- Footer ---- */
    "footer.motto": "penser · grandir · <em>innover</em>",
    "footer.club": "Le club",
    "footer.contact": "Contact",
    "footer.school": "Nom de l’école", // TODO: nom officiel de l’établissement
    "footer.theme": "Thème 2026–27 : IA & Nature",

    /* ---- Registration page ---- */
    "reg.eyebrow": "Adhésion 2026–27",
    "reg.title": "Deviens <em>membre</em>.",
    "reg.lead": "Remplis ce formulaire pour rejoindre AI INNOVATORS. On te recontacte par e-mail avec l’invitation au Discord et la date de la soirée de lancement.",
    "reg.perks": [
      { text: "Une place dans l’un des 5 projets IA & Nature" },
      { text: "Des ateliers pour apprendre en construisant" },
      { text: "La préparation aux certifications IA" },
      { text: "Le Discord du club et son réseau" }
    ],
    "reg.time": "Environ 2 minutes · les champs marqués * sont obligatoires",
    "reg.formTitle": "Formulaire d’inscription",

    "f.legend.you": "Toi",
    "f.legend.studies": "Tes études",
    "f.legend.interests": "Tes envies",
    "f.fullName": "Nom complet",
    "f.fullName.ph": "Prénom Nom",
    "f.email": "E-mail",
    "f.email.ph": "prenom.nom@ecole.tn",
    "f.email.hint": "De préférence ton adresse étudiante.",
    "f.phone": "Téléphone",
    "f.phone.ph": "Ex. : 22 123 456",
    "f.studentId": "Numéro étudiant",
    "f.studentId.ph": "Ex. : 20261234",
    "f.department": "Filière",
    "f.choose": "Choisir…",
    "f.dep.mechanical": "Génie mécanique",
    "f.dep.civil": "Génie civil",
    "f.dep.industrial": "Génie industriel",
    "f.year": "Année d’études",
    "f.year.1": "1re année",
    "f.year.2": "2e année",
    "f.year.3": "3e année",
    "f.interests": "Les projets qui te tentent",
    "f.interests.hint": "Plusieurs choix possibles.",
    "f.int.certs": "Certifications IA",
    "f.roles": "Le rôle qui te plaît",
    "f.role.frontend": "Front-end",
    "f.role.ai": "Intégration IA",
    "f.role.ux": "UX / UI",
    "f.role.database": "Base de données",
    "f.role.research": "Recherche",
    "f.role.testing": "Tests",
    "f.experience": "Ton niveau en IA / code",
    "f.exp.beginner": "Débutant·e",
    "f.exp.intermediate": "Intermédiaire",
    "f.exp.advanced": "Avancé·e",
    "f.motivation": "Pourquoi veux-tu nous rejoindre ?",
    "f.motivation.ph": "Un projet, une idée, une curiosité…",
    "f.optional": "(facultatif)",
    "f.source": "Comment as-tu connu le club ?",
    "f.src.social": "Réseaux sociaux",
    "f.src.friend": "Un·e ami·e",
    "f.src.poster": "Affiche sur le campus",
    "f.src.event": "Un événement du club",
    "f.src.teacher": "Un·e enseignant·e",
    "f.src.other": "Autre",
    "f.consent": "J’accepte que AI INNOVATORS conserve ces informations pour gérer mon adhésion et me contacter au sujet des activités du club.",
    "f.submit": "Envoyer mon inscription",
    "f.sending": "Envoi en cours…",

    "err.required": "Ce champ est obligatoire.",
    "err.name": "Indique ton prénom et ton nom.",
    "err.email": "Cette adresse e-mail ne semble pas valide.",
    "err.domain": "Utilise ton adresse e-mail étudiante.",
    "err.phone": "Ce numéro ne semble pas valide.",
    "err.choose": "Choisis une option.",
    "err.interests": "Choisis au moins un projet.",
    "err.consent": "Ton accord est nécessaire pour t’inscrire.",
    "err.fix": "Quelques champs sont à corriger.",
    "err.network": "L’envoi a échoué. Vérifie ta connexion et réessaie.",
    "err.duplicate": "Cette adresse e-mail est déjà inscrite. À très vite !",

    "ok.eyebrow": "Inscription reçue",
    "ok.title": "Bienvenue parmi nous,",
    "ok.text": "Ta graine est plantée. On t’écrit très bientôt avec l’invitation au Discord et la date de la soirée de lancement.",
    "ok.home": "Retour au site",
    "ok.again": "Inscrire quelqu’un d’autre"
  },

  en: {
    /* ---- Meta & accessibility ---- */
    "meta.title.home": "AI INNOVATORS · AI & Nature",
    "meta.desc.home": "AI INNOVATORS, the student artificial intelligence club. 2026–27 theme: AI & Nature. Projects, workshops, certifications. Registration is open.",
    "meta.title.register": "Register · AI INNOVATORS",
    "meta.desc.register": "Join AI INNOVATORS: free membership, open to every student.",
    "a11y.skip": "Skip to content",
    "a11y.menu": "Menu",
    "a11y.lang": "Language",

    /* ---- Navigation ---- */
    "nav.about": "The club",
    "nav.program": "Program",
    "nav.activities": "Projects",
    "nav.register": "Register",
    "nav.back": "Back to the site",

    /* ---- Hero ---- */
    "hero.eyebrow": "2026–27 theme · AI & Nature",
    "hero.title": "Where intelligence<br>takes <span class=\"glow\">root</span>",
    "hero.lead": "AI INNOVATORS is our student AI club. This year, we put AI to work for olive groves, beaches and Tunisia’s biodiversity, with real projects from day one.",
    "hero.cta": "Join the club",
    "hero.secondary": "See the program",
    "hero.note": "Registration open · free · all levels",
    "hero.scroll": "scroll",

    /* ---- About ---- */
    "about.eyebrow": "01 · The club",
    "about.h1": "Students who <em>build</em>.",
    "about.p1": "AI INNOVATORS brings together students from every field (computer science, biology, engineering, design) who want to understand artificial intelligence by making it. No expertise needed: curiosity is enough.",
    "about.h2": "Nature that <em>inspires</em>.",
    "about.p2": "Neural networks mimic the brain; genetic algorithms mimic evolution. This year we go back to the source: nature as a model, as data, and as a cause worth defending.",
    "about.stats": [
      { value: "5", label: "AI & Nature projects" },
      { value: "3+", label: "certification tracks" },
      { value: "0", label: "hardware required" },
      { value: "120+", label: "members" } // TODO: real member count
    ],

    /* ---- Theme story (scroll animation) ---- */
    "story.label": "Why AI & Nature?",
    "story.cap1": "A leaf vein carries sap.",
    "story.cap2": "A network carries signal.",
    "story.cap3": "Nature invented the network long before we did. This year, we learn from it and work for it.",

    /* ---- Values ---- */
    "values.eyebrow": "Our values",
    "values.title": "Three roots that keep us <em>grounded</em>.",
    "values.list": [
      { text: "Learn by building: every idea ends up as a prototype, however rough." },
      { text: "Open to all: in a forest every species has its place, and so does every major and every level." },
      { text: "Responsible AI: frugal with energy and useful to living things. Never the other way round." }
    ],

    /* ---- Program ---- */
    "program.eyebrow": "02 · The program",
    "program.title": "One year, four <em>seasons</em>.",
    "program.lead": "From the first project to the final showcase, the year follows nature’s rhythm: we sow, take root, bloom, then harvest.",
    // TODO: adjust months to the real calendar
    "program.seasons": [
      {
        season: "Autumn", months: "Oct to Nov", title: "Sowing the seeds",
        text: "Club kick-off and a first project designed for beginners.",
        points: ["Kick-off night", "AI Nature Detective", "Challenge: can AI identify Tunisia’s biodiversity?"]
      },
      {
        season: "Winter", months: "Dec to Feb", title: "Growing roots",
        text: "Two projects in mixed teams: everyone has a role, no need to be an AI expert.",
        points: ["Plant Doctor", "AI Waste Classifier", "Certification prep"]
      },
      {
        season: "Spring", months: "Mar to Apr", title: "In bloom",
        text: "Out into the field: beach photos and a sustainable-city workshop.",
        points: ["AI Beach Pollution Detector", "Photo collection on local beaches", "AI Green City workshop"]
      },
      {
        season: "Summer", months: "May to Jun", title: "The harvest",
        text: "We present our projects and celebrate the certifications earned.",
        points: ["Project showcase", "Certificates ceremony", "New board election"]
      }
    ],

    /* ---- Projects (from activities.md) ---- */
    "projects.eyebrow": "03 · Projects",
    "projects.title": "Five projects, <em>zero sensors</em>.",
    "projects.lead": "A laptop and an internet connection are all you need. Front-end, AI integration, UX/UI, data, research or testing: everyone finds a role.",
    "projects.items": [
      { icon: "#i-detective", level: "Best to start", title: "AI Nature Detective", text: "Snap a nature photo and AI identifies the species, its role and a fun fact.", input: "Photo", output: ["Olive tree", "Plant", "94%"] },
      { icon: "#i-doctor", level: "Accessible", title: "Plant Doctor", text: "AI checks a leaf for deficiencies or disease, then explains what to do.", input: "Leaf", output: ["Healthy", "Deficiency", "Fungus"] },
      { icon: "#i-wave", level: "High impact", title: "AI Beach Pollution Detector", text: "AI counts the waste in a beach photo and calculates a pollution score.", input: "Beach", output: ["12 bottles", "7 bags", "Score 68/100"] },
      { icon: "#i-recycle", level: "Easy", title: "AI Waste Classifier", text: "AI recognises a piece of waste and tells you which bin it goes in. Arduino version optional.", input: "Waste", output: ["Plastic", "Recyclable", "Plastic bin"] },
      { icon: "#i-city", level: "Workshop", title: "AI Green City", text: "Describe a city; AI proposes a greener plan and visualises it.", input: "City", output: ["Green spaces", "Bike lanes", "Solar"] }
    ],
    "certs.title": "AI & automation certifications",
    "certs.text": "We prepare for them together, at your own pace.",
    "certs.items": [{ name: "Anthropic" }, { name: "AWS" }, { name: "Microsoft" }, { name: "and more" }],

    /* ---- Join CTA ---- */
    "join.eyebrow": "Registration open",
    "join.title": "Be part of the <em>next growth</em>.",
    "join.lead": "Membership is free and open to every student, whatever your level. Two minutes to sign up, a whole year to grow.",
    "join.cta": "Register now",
    "join.notes": [{ text: "Free" }, { text: "All majors" }, { text: "Beginners welcome" }],

    /* ---- Footer ---- */
    "footer.motto": "think · grow · <em>innovate</em>",
    "footer.club": "The club",
    "footer.contact": "Contact",
    "footer.school": "College name", // TODO: official name of the college
    "footer.theme": "2026–27 theme: AI & Nature",

    /* ---- Registration page ---- */
    "reg.eyebrow": "Membership 2026–27",
    "reg.title": "Become a <em>member</em>.",
    "reg.lead": "Fill in this form to join AI INNOVATORS. We’ll get back to you by email with your Discord invitation and the date of the kick-off night.",
    "reg.perks": [
      { text: "A seat in one of the 5 AI & Nature projects" },
      { text: "Workshops to learn by building" },
      { text: "Preparation for AI certifications" },
      { text: "The club Discord and its network" }
    ],
    "reg.time": "About 2 minutes · fields marked * are required",
    "reg.formTitle": "Registration form",

    "f.legend.you": "You",
    "f.legend.studies": "Your studies",
    "f.legend.interests": "Your interests",
    "f.fullName": "Full name",
    "f.fullName.ph": "First Last",
    "f.email": "Email",
    "f.email.ph": "first.last@college.tn",
    "f.email.hint": "Your student address, ideally.",
    "f.phone": "Phone",
    "f.phone.ph": "e.g. 22 123 456",
    "f.studentId": "Student ID",
    "f.studentId.ph": "e.g. 20261234",
    "f.department": "Field of study",
    "f.choose": "Choose…",
    "f.dep.mechanical": "Mechanical engineering",
    "f.dep.civil": "Civil engineering",
    "f.dep.industrial": "Industrial engineering",
    "f.year": "Year of study",
    "f.year.1": "1st year",
    "f.year.2": "2nd year",
    "f.year.3": "3rd year",
    "f.interests": "Projects you’d like to join",
    "f.interests.hint": "Pick as many as you like.",
    "f.int.certs": "AI certifications",
    "f.roles": "Roles you’d enjoy",
    "f.role.frontend": "Front-end",
    "f.role.ai": "AI integration",
    "f.role.ux": "UX / UI",
    "f.role.database": "Database",
    "f.role.research": "Research",
    "f.role.testing": "Testing",
    "f.experience": "Your level in AI / coding",
    "f.exp.beginner": "Beginner",
    "f.exp.intermediate": "Intermediate",
    "f.exp.advanced": "Advanced",
    "f.motivation": "Why do you want to join?",
    "f.motivation.ph": "A project, an idea, a curiosity…",
    "f.optional": "(optional)",
    "f.source": "How did you hear about the club?",
    "f.src.social": "Social media",
    "f.src.friend": "A friend",
    "f.src.poster": "Poster on campus",
    "f.src.event": "A club event",
    "f.src.teacher": "A teacher",
    "f.src.other": "Other",
    "f.consent": "I agree that AI INNOVATORS may keep this information to manage my membership and contact me about club activities.",
    "f.submit": "Send my registration",
    "f.sending": "Sending…",

    "err.required": "This field is required.",
    "err.name": "Please enter your first and last name.",
    "err.email": "This email address doesn’t look valid.",
    "err.domain": "Please use your student email address.",
    "err.phone": "This phone number doesn’t look valid.",
    "err.choose": "Please choose an option.",
    "err.interests": "Pick at least one project.",
    "err.consent": "We need your consent to register you.",
    "err.fix": "A few fields need fixing.",
    "err.network": "Sending failed. Check your connection and try again.",
    "err.duplicate": "This email is already registered. See you soon!",

    "ok.eyebrow": "Registration received",
    "ok.title": "Welcome aboard,",
    "ok.text": "Your seed is planted. We’ll write to you very soon with your Discord invitation and the date of the kick-off night.",
    "ok.home": "Back to the site",
    "ok.again": "Register someone else"
  }
};
