
import { Subject, Mood, StudyMode, Curriculum } from './types';
import { BookOpen, Activity, Briefcase, Zap, Brain, HeartPulse, Dna, Compass } from 'lucide-react';

export const SUBJECT_CONFIG = {
  [Subject.MATHS]: {
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Activity,
    description: 'Analytical & Euclidean Geometry, Algebra, Trig, Functions',
    tips: '🧠 Teacher Tip: In Grade 11, Geometry proofs are 30% of Paper 2. Never assume a line is a tangent; prove it.'
  },
  [Subject.PHYSICS]: {
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Zap,
    description: 'Newton\'s Laws, Electrostatics, Chemistry Bonding, Stoichiometry',
    tips: '⚡ Teacher Tip: Always start Newton calculations with a Free Body Diagram. If the FBD is wrong, the calculation is wrong.'
  },
  [Subject.BIOLOGY]: {
    color: 'bg-teal-600',
    textColor: 'text-teal-600',
    lightColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    icon: Dna,
    description: 'Biodiversity (Microbes, Plants, Animals), Human Systems, Ecology',
    tips: '🌿 Teacher Tip: Biology is specific. Don\'t say "it changes shape"; say "the enzyme undergoes a conformational change". Terminology is key.'
  },
  [Subject.BUSINESS]: {
    color: 'bg-emerald-600',
    textColor: 'text-emerald-600',
    lightColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: Briefcase,
    description: 'Environments, Operations, Professionalism, Creative Thinking',
    tips: 'mj Teacher Tip: In essays (Section C), structure is everything. Introduction, Body (with headings), Conclusion. Link every fact to the Case Study.'
  },
  [Subject.LO]: {
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    lightColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Compass,
    description: 'Self-development, Democracy, Careers, Study Skills',
    tips: '🧘‍♂️ Teacher Tip: LO is about critical thinking. Define the concept, then apply it to a real-world South African context.'
  },
  [Subject.GENERAL]: {
    color: 'bg-slate-600',
    textColor: 'text-slate-600',
    lightColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: Brain,
    description: 'Metacognition, Stress Management, Exam Strategy',
    tips: '🍅 Teacher Tip: Consistent small efforts beat last-minute cramming. Trust the process.'
  }
};

export const MOOD_ICONS = {
  [Mood.NEUTRAL]: '😐',
  [Mood.STRESSED]: '😫',
  [Mood.CONFIDENT]: '😎',
  [Mood.CONFUSED]: '🤔',
  [Mood.TIRED]: '😴'
};

// Detailed IEB Syllabus Data
export const IEB_SYLLABUS = {
  [Subject.MATHS]: {
    g11: "GEOMETRY: Analytical (Distance, Gradient, Midpoint, Equation of Line y-y1=m(x-x1), Angle of Inclination tanθ=m). Euclidean (Circle Geometry: Line from centre perp to chord, Angle at centre=2x angle at circum, Cyclic Quads, Tangents: Tan-Chord Theorem). ALGEBRA: Exponents & Surds (Laws, Rationalizing Denom), Quadratic Equations (Nature of Roots Δ=b²-4ac, K-method substitution), Inequalities. TRIG: Reductions, Identities, General Solution, Sine/Cosine/Area Rules (Proofs required). STATISTICS: Ogives, Variance, Standard Deviation, Box & Whisker (Symmetric vs Skewed). FUNCTIONS: Parabola, Hyperbola, Exponential (shifting p and q units).",
    g12: "Functions (Inverse, Logarithmic, Cubic), Calculus (First Principles, Rules, Tangents, Cubic Graphs, Optimization), Sequences & Series (Sigma Notation), Financial Maths (Annuities, Future/Present Value), 3D Trigonometry, Advanced Euclidean Geometry (Proportionality)."
  },
  [Subject.PHYSICS]: {
    g11: "PHYSICS: Vectors in 2D (Closed vector triangles). Newton's Laws 1, 2, 3 & Universal Gravitation (Calculations on slopes/pulleys). Electrostatics (Coulomb's Law, Electric Fields). Electromagnetism (Faraday & Lenz). Electric Circuits (Ohm's Law, Internal Resistance). CHEMISTRY: Atomic Bonding (Lewis, VSEPR shapes: Linear/Trigonal/Tetrahedral). Intermolecular Forces (Hydrogen bonds vs Van der Waals - boiling points). Ideal Gases (PV=nRT). Stoichiometry (Limiting Reagents). Energy Change (Exo/Endothermic). Acids & Bases (Titrations). Redox (Oxidation numbers). Lithosphere (Gold Mining process).",
    g12: "PHYSICS: Vertical Projectile Motion, Momentum & Impulse, Work Energy & Power (Work-Energy Theorem), Doppler Effect (Sound/Light), Photoelectric Effect. CHEMISTRY: Organic Chemistry (IUPAC, Isomers, Reactions: Substitution/Addition/Elimination), Rates of Reaction, Chemical Equilibrium (Kc), Acids & Bases (Hydrolysis), Galvanic & Electrolytic Cells, Fertilizers (NPK)."
  },
  [Subject.BIOLOGY]: {
    g11: "MICRO-ORGANISMS: Viruses (HIV/AIDS management), Bacteria (TB, Rhizobium, Ecological role), Fungi (Thrush, Ringworm, Decomposition), Protists (Malaria lifecycle). Immunity (Active vs Passive). PLANTS: 4 Divisions (Bryophytes, Pteridophytes, Gymnosperms, Angiosperms). Life cycles & Reproduction (Alternation of generations). ANIMALS: Body Plans (Symmetry, Cephalisation, Coelom, Gut openings). Phyla: Porifera, Cnidaria, Platyhelminthes, Annelida, Arthropoda, Chordata. HUMAN: Nutrition (Digestive system, Enzymes, Villi absorption), Respiration (Gas exchange, Breathing mech), Excretion (Kidney/Nephron structure, Homeostasis: ADH/Aldosterone). Population Ecology (Growth curves, Mark-recapture).",
    g12: "DNA & RNA (Protein Synthesis), Meiosis, Genetics (Monohybrid/Dihybrid, Pedigrees, Genetic Engineering), Human Reproduction, Nervous System (Brain, Eye, Ear, Reflex arc), Endocrine System, Homeostasis (Glucose, Temp), Evolution (Natural Selection, Hominids)."
  },
  [Subject.BUSINESS]: {
    g11: "ENVIRONMENTS: Micro (Internal), Market (Porter's 5 Forces), Macro (PESTLE). VENTURES: Entrepreneurship, Forms of Ownership, Franchising, Business Plans. ROLES: Creative Thinking (Delphi, Force-Field), Stress Management, Professionalism vs Ethics. OPERATIONS: Marketing (7Ps), Production (Quality/Safety), HR (Recruitment, Selection, Legislation).",
    g12: "Legislation (LRA, BCEA, OHSA, BBBEE), Investment (JSE, Unit Trusts), Human Rights & Inclusivity, Conflict Management, Industrial Relations, Quality Performance (TQM), CSR vs CSI."
  },
  [Subject.LO]: {
    g11: "Self-Development (Goal setting), Social Responsibility (Climate change), Democracy (Bill of Rights), Careers (University requirements, CVs, Funding), Study Skills.",
    g12: "Stress Management, Environmental Crises, CV & Interview Skills, Labour Laws, Transition to Adulthood."
  },
  [Subject.GENERAL]: {
    g11: "General academic support.",
    g12: "Matric final prep."
  }
};

// Curriculum Data Structure for Lessons
// EXPANDED TO BE COMPREHENSIVE
export const CURRICULUM: Record<Subject, Curriculum> = {
  [Subject.MATHS]: {
    modules: [
      {
        id: 'm1', title: 'Algebra & Equations', topics: [
          { id: 't1', title: 'Exponents & Surds', description: 'Laws of exponents, Exponential equations, Rationalizing denominators.' },
          { id: 't2', title: 'Quadratic Equations', description: 'Standard form, Factorization, Formula, K-method substitution.' },
          { id: 't3', title: 'Nature of Roots', description: 'The Discriminant (Delta): Real, Non-real, Rational, Irrational roots.' },
          { id: 't4', title: 'Quadratic Inequalities', description: 'Critical values, Number line method, Parabola method.' },
          { id: 't4b', title: 'Simultaneous Equations', description: 'Solving linear and quadratic equations simultaneously.' }
        ]
      },
      {
        id: 'm2', title: 'Functions & Graphs', topics: [
          { id: 't_f1', title: 'The Parabola', description: 'Standard form, Turning point, Axis of symmetry, Domain/Range.' },
          { id: 't_f2', title: 'The Hyperbola', description: 'Asymptotes, Shapes, Domain/Range, Point of intersection.' },
          { id: 't_f3', title: 'Exponential Functions', description: 'Asymptotes, Growth/Decay, Intercepts.' },
          { id: 't_f4', title: 'Interpretation of Graphs', description: 'Finding lengths, Intersections, Inequalities from graphs.' }
        ]
      },
      {
        id: 'm3', title: 'Trigonometry', topics: [
          { id: 't5', title: 'Reduction Formulae', description: 'CAST diagram, Co-functions, Negative angles.' },
          { id: 't6', title: 'Trig Identities', description: 'Square identity, Quotient identity, Proving identities.' },
          { id: 't7', title: 'General Solution', description: 'Solving trig equations, Specific solutions in intervals.' },
          { id: 't8', title: 'Sine, Cosine & Area Rules', description: 'Solving 2D triangles, Proofs of the rules.' }
        ]
      },
      {
        id: 'm4', title: 'Euclidean Geometry', topics: [
          { id: 't9', title: 'Circle Geometry A', description: 'Lines from centre, Perpendicular bisectors, Chords.' },
          { id: 't10', title: 'Circle Geometry B', description: 'Cyclic Quadrilaterals: Properties and Proofs.' },
          { id: 't11', title: 'Tangents', description: 'Tan-Chord theorem, Tangents from same point.' }
        ]
      }
    ]
  },
  [Subject.PHYSICS]: {
    modules: [
      {
        id: 'p1', title: 'Mechanics (Physics)', topics: [
          { id: 'pt1', title: 'Vectors in 2D', description: 'Resultants, Components, Closed vector triangles.' },
          { id: 'pt2', title: 'Newton 1, 2 & 3', description: 'Inertia, Fnet=ma, Action-Reaction pairs.' },
          { id: 'pt3', title: 'Newton\'s Law of Gravitation', description: 'Universal gravitation, Mass vs Weight.' },
          { id: 'pt3b', title: 'Friction & Slopes', description: 'Static vs Kinetic friction, Forces on inclined planes.' }
        ]
      },
      {
        id: 'p2', title: 'Matter & Materials (Chem)', topics: [
          { id: 'pt4', title: 'Intermolecular Forces', description: 'Hydrogen bonds, Dipole-dipole, London forces. Effect on Boiling Point.' },
          { id: 'pt5', title: 'Ideal Gases', description: 'Boyle, Charles, Gay-Lussac, PV=nRT calculations.' },
          { id: 'pt6', title: 'Atomic Combinations', description: 'Lewis structures, Electronegativity, VSEPR shapes.' }
        ]
      },
      {
        id: 'p3', title: 'Chemical Change (Chem)', topics: [
          { id: 'pt7', title: 'Quantitative Chemistry', description: 'The Mole, Molar Mass, Concentration, Stoichiometry.' },
          { id: 'pt8', title: 'Energy & Change', description: 'Exothermic/Endothermic, Activation Energy, Bond energy.' },
          { id: 'pt9', title: 'Acids & Bases', description: 'Models (Arrhenius/Lowry-Bronsted), pH, Titrations.' }
        ]
      },
      {
        id: 'p4', title: 'Electricity & Magnetism', topics: [
          { id: 'pt10', title: 'Electrostatics', description: 'Coulomb\'s Law, Electric Fields.' },
          { id: 'pt11', title: 'Electric Circuits', description: 'Ohm\'s Law, Series/Parallel, Internal Resistance.' },
          { id: 'pt12', title: 'Electromagnetism', description: 'Magnetic flux, Faraday\'s Law, Lenz\'s Law.' }
        ]
      }
    ]
  },
  [Subject.BIOLOGY]: {
    modules: [
      {
        id: 'b1', title: 'Diversity & Micro-organisms', topics: [
          { id: 'bt1', title: 'Viruses & Bacteria', description: 'Structure, Reproduction, Diseases (TB, HIV), Economic use.' },
          { id: 'bt2', title: 'Fungi & Protists', description: 'Structure, Roles, Malaria Lifecycle.' },
          { id: 'bt3', title: 'Immunity', description: 'Innate vs Acquired, Vaccines, Antibody action.' }
        ]
      },
      {
        id: 'b2', title: 'Plant Diversity', topics: [
          { id: 'bt4', title: 'Plant Phyla', description: 'Bryophytes to Angiosperms: Vascular tissue, Seeds, Fruit.' },
          { id: 'bt5', title: 'Plant Reproduction', description: 'Asexual (Vegetative) vs Sexual. Pollination mechanisms.' }
        ]
      },
      {
        id: 'b3', title: 'Animal Nutrition', topics: [
          { id: 'bt6', title: 'Human Digestive System', description: 'Alimentary canal, Accessory organs, Mechanical vs Chemical digestion.' },
          { id: 'bt7', title: 'Absorption & Assimilation', description: 'Villus structure, Hepatic Portal System, Homeostasis of Blood Sugar.' }
        ]
      },
       {
        id: 'b4', title: 'Respiration', topics: [
          { id: 'bt8', title: 'Cellular Respiration', description: 'Aerobic vs Anaerobic (Glycolysis, Krebs, Oxidative Phosphorylation).' },
          { id: 'bt9', title: 'Human Gas Exchange', description: 'Breathing mechanism, Alveoli structure, Transport of O2/CO2.' }
        ]
      },
      {
        id: 'b5', title: 'Excretion', topics: [
           { id: 'bt10', title: 'The Kidney', description: 'Structure of Nephron, Ultra-filtration, Reabsorption, Tubular Excretion.' }
        ]
      }
    ]
  },
  [Subject.BUSINESS]: {
    modules: [
      {
        id: 'bs1', title: 'Business Environments', topics: [
          { id: 'bst1', title: 'The Environments', description: 'Interrelationship between Micro, Market, and Macro.' },
          { id: 'bst2', title: 'Complex Challenges', description: 'Strikes, Political change, Socio-economic issues.' }
        ]
      },
      {
        id: 'bs2', title: 'Business Ventures', topics: [
          { id: 'bst3', title: 'Entrepreneurship', description: 'Qualities, Success factors, Push/Pull factors.' },
          { id: 'bst4', title: 'Forms of Ownership', description: 'Sole Trader, Partnership, Close Corp, Pty Ltd, Public Company.' },
          { id: 'bst5', title: 'Business Plans', description: 'Structure, SWOT analysis, Financial plans.' }
        ]
      },
      {
        id: 'bs3', title: 'Business Roles', topics: [
          { id: 'bst6', title: 'Creative Thinking', description: 'Indigenous knowledge, Problem solving vs Decision making.' },
          { id: 'bst7', title: 'Professionalism', description: 'Ethics, Professionalism, Code of Conduct.' },
          { id: 'bst8', title: 'Team Performance', description: 'Stages of development, Conflict management.' }
        ]
      },
      {
         id: 'bs4', title: 'Business Operations', topics: [
           { id: 'bst9', title: 'Marketing Function', description: 'The 7 Ps, Branding, Consumer Protection Act.' },
           { id: 'bst10', title: 'Human Resources', description: 'Recruitment, Selection, Placement, Induction, LRA/BCEA.' }
         ]
      }
    ]
  },
  [Subject.LO]: { modules: [] },
  [Subject.GENERAL]: { modules: [] }
};

// Stored "Photographic Memory" Diagrams - BEST QUALITY, LEGIBLE, EASY TO REMEMBER
export const CORE_DIAGRAMS = {
  [Subject.BUSINESS]: {
    porters_forces: `graph TD
      style C fill:#ffcccc,stroke:#333,stroke-width:2px
      style N fill:#e6f3ff,stroke:#333
      style S fill:#e6f3ff,stroke:#333
      style B fill:#e6f3ff,stroke:#333
      style P fill:#e6f3ff,stroke:#333
      C[🔥 COMPETITIVE RIVALRY] <--> N[New Entrants]
      C <--> S[Substitutes]
      C <--> B[Buyer Power]
      C <--> P[Supplier Power]
      N -.->|Barrier to Entry| C
      S -.->|Price Ceiling| C`,
    maslow: `graph BT
      style A fill:#ff9999,stroke:#333,stroke-width:2px
      style B fill:#ffcc99,stroke:#333
      style C fill:#ffff99,stroke:#333
      style D fill:#99ff99,stroke:#333
      style E fill:#99ccff,stroke:#333
      A[🏆 Self-Actualization]
      B[🥇 Esteem Needs] --> A
      C[🤝 Social Needs] --> B
      D[🏠 Safety Needs] --> C
      E[🍔 Physiological Needs] --> D`,
    pestle: `graph TD
      Center((PESTLE))
      Center --- P[Political]
      Center --- E1[Economic]
      Center --- S[Social]
      Center --- T[Technological]
      Center --- L[Legal]
      Center --- E2[Environmental]
      style Center fill:#f9f,stroke:#333,stroke-width:4px`,
    entrepreneur_qualities: `mindmap
      root((Entrepreneur))
        Risk Taker
        Innovative
        Commitment
        Passion
        Leadership
        Organization`
  },
  [Subject.MATHS]: {
    nature_of_roots: `graph TD
      Start{Calculate Δ<br/>b² - 4ac}
      style Start fill:#f9f,stroke:#333,stroke-width:4px
      Start -->|Δ < 0| NonReal[🚫 Non-Real]
      Start -->|Δ ≥ 0| Real[✅ Real]
      Real -->|Δ = 0| Equal[Equal Roots]
      Real -->|Δ > 0| Unequal{Unequal}
      Unequal -->|Perfect Sq| Rational[Rational Q]
      Unequal -->|Not Perfect| Irrational[Irrational Q']
      style NonReal fill:#ffcccc
      style Equal fill:#ccffcc
      style Rational fill:#ccccff`,
    trig_cast: `quadrantChart
      x-axis 180° ... 0° / 360°
      y-axis 270° ... 90°
      quadrant-1 All Ratios (+)
      quadrant-2 Sin (+)
      quadrant-3 Tan (+)
      quadrant-4 Cos (+)`,
    quadrilaterals: `graph BT
      Square --> Rectangle
      Square --> Rhombus
      Rectangle --> Parallelogram
      Rhombus --> Parallelogram
      Parallelogram --> Quadrilateral
      Trapezium --> Quadrilateral
      Kite --> Quadrilateral
      style Square fill:#f96,stroke:#333,stroke-width:2px`
  },
  [Subject.BIOLOGY]: {
    reflex_arc: `sequenceDiagram
      autonumber
      participant S as 🔥 Stimulus
      participant R as Receptor
      participant SN as Sensory Neuron
      participant SC as 🧠 Spinal Cord
      participant MN as Motor Neuron
      participant E as 💪 Muscle
      S->>R: Burns finger
      R->>SN: Electrical Impulse
      SN->>SC: Interneuron Process
      SC->>MN: Fast Response
      MN->>E: Contract!
      Note right of E: Hand pulls away`,
    classification: `graph TD
      K[👑 Kingdom] --> P[Phylum]
      P --> C[Class]
      C --> O[Order]
      O --> F[Family]
      F --> G[Genus]
      G --> S[Species]
      style K fill:#ff9999
      style P fill:#ffcc99
      style C fill:#ffff99
      style O fill:#99ff99
      style F fill:#99ffff
      style G fill:#99ccff
      style S fill:#cc99ff`,
    heart_flow: `graph TD
      subgraph Deoxygenated
      Body -->|Vena Cava| RA[Right Atrium]
      RA -->|Tricuspid| RV[Right Ventricle]
      RV -->|Pulmonary Valve| PA[Pulmonary Artery]
      end
      
      PA --> Lungs
      
      subgraph Oxygenated
      Lungs -->|Pulmonary Vein| LA[Left Atrium]
      LA -->|Bicuspid/Mitral| LV[Left Ventricle]
      LV -->|Aortic Valve| Aorta
      end
      
      Aorta --> Body

      style Deoxygenated fill:#e1f5fe,stroke:#0277bd
      style Oxygenated fill:#ffebee,stroke:#c62828
      style Lungs fill:#e8f5e9,stroke:#2e7d32
      style Body fill:#fff3e0,stroke:#ef6c00`
  },
  [Subject.PHYSICS]: {
    stoichiometry_mole_map: `graph TD
      A[Mass (m)] <-->|n=m/M| B((Moles n))
      C[Volume Gas] <-->|n=V/22.4| B
      D[Particles] <-->|n=N/NA| B
      E[Conc (c)] <-->|n=cV| B
      style B fill:#ffff00,stroke:#333,stroke-width:4px
      style A fill:#e1f5fe
      style C fill:#e1f5fe
      style D fill:#e1f5fe
      style E fill:#e1f5fe`,
    newton_strategy: `graph TD
      Start(Problem) --> FBD[1. Draw Free Body Diagram]
      FBD --> Axes[2. Choose Axes x/y]
      Axes --> Resolve[3. Resolve Forces]
      Resolve --> Fnet[4. Fnet = ma]
      Fnet --> Solve[5. Solve Equations]
      style FBD fill:#ffcc99,stroke:#333
      style Fnet fill:#99ccff,stroke:#333`,
    circuit_logic: `graph TD
      Source((Battery)) --> Split{Branch?}
      Split -->|No| Series[SERIES]
      Series --> S1[I is Constant]
      Series --> S2[V Divides]
      Series --> S3[R_total increases]
      Split -->|Yes| Parallel[PARALLEL]
      Parallel --> P1[V is Constant]
      Parallel --> P2[I Divides]
      Parallel --> P3[R_total decreases]
      style Series fill:#ffcccc
      style Parallel fill:#ccffcc`
  },
  [Subject.LO]: {
    smart_goals: `graph LR
      S[Specific] --> M[Measurable]
      M --> A[Achievable]
      A --> R[Relevant]
      R --> T[Time-bound]
      style S fill:#ff9999
      style T fill:#99ccff`,
    decision_making: `graph TD
      A[1. Define Problem] --> B[2. Identify Alternatives]
      B --> C[3. Evaluate Pros/Cons]
      C --> D[4. Choose Solution]
      D --> E[5. Act]
      E --> F[6. Evaluate Outcome]
      style D fill:#ffff99,stroke:#333`
  },
  [Subject.GENERAL]: {
    pomodoro: `pie title Study Cycle
      "Focus (25m)" : 25
      "Break (5m)" : 5
      "Focus (25m)" : 25
      "Break (5m)" : 5`,
    memory_curve: `graph LR
      A[Learn] -->|1 hr| B[Forgot 50%]
      B -->|24 hrs| C[Forgot 70%]
      A -.->|Review 10m| D[Retain 90%]
      D -.->|Review 24h| E[Retain 100%]
      style E fill:#99ff99`
  }
};

// Advanced System Instruction: CLASSROOM TEACHER PERSONA
export const INITIAL_SYSTEM_INSTRUCTION = `
You are Mr./Ms. Nexus, a Senior Grade 11 IEB Teacher and Examiner.
You are NOT a summarizer. You are a **Teacher**.

**Your Classroom Philosophy:**
1.  **Completeness:** You teach the **full extent** of the syllabus. Do not skip details. If a topic has 3 sub-sections, teach all 3.
2.  **Authority:** You speak with the confidence of someone who marks Matric finals. You know *exactly* where students lose marks.
3.  **Interaction:** You are teaching a class. Use phrases like "Listen carefully," "Note this down," and "Let's look at an example."
4.  **Visuals:** You rely heavily on diagrams (Dual Coding).

**Study Mode: {STUDY_MODE}**
- **Standard**: Strictly Grade 11 IEB SAGs (Subject Assessment Guidelines).
- **Advanced**: Bridge the gap to Grade 12. Mention how this topic evolves next year.

**Psychological Techniques:**
- **Metacognition:** "Why do we use this formula here?"
- **Interleaving:** Connect this topic to previous ones (e.g., "Recall from Grade 10...").

**Subject-Specific Rules:**
- **MATHS:** Strict notation. Rounding instructions. Logical steps (Statement, Reason).
- **BIOLOGY:** Precise biological terminology. No vague descriptions. Structure fits function.
- **PHYSICS:** Units, Direction (Vectors), FBDs are mandatory.
- **BUSINESS:** Application to the Case Study. Structure (Intro, Body, Conclusion).

**Context:**
- Subject: {SUBJECT}
- Syllabus: {G11_SYLLABUS}
- **AVAILABLE DIAGRAM LIBRARY**: {CORE_DIAGRAMS_JSON} (Use these codes exactly when relevant).
`;
