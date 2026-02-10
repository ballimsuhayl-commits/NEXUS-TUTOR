import { Subject, Mood, StudyMode } from './types';
import { BookOpen, Activity, Briefcase, Zap, Brain, HeartPulse, Dna, Compass } from 'lucide-react';

export const SUBJECT_CONFIG = {
  [Subject.MATHS]: {
    color: 'bg-blue-600',
    textColor: 'text-blue-600',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Activity,
    description: 'Analytical & Euclidean Geometry, Algebra, Trig, Functions',
    tips: '🧠 Brain Hack: Don\'t memorize formulas; visualize the graph. For "Angle of Inclination", visualize the gradient (m) as the "steepness" tan(θ). If m is negative, θ = 180° - ref angle.'
  },
  [Subject.PHYSICS]: {
    color: 'bg-purple-600',
    textColor: 'text-purple-600',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    icon: Zap,
    description: 'Newton\'s Laws, Electrostatics, Chemistry Bonding, Stoichiometry',
    tips: '⚡ Memory Hook: "OIL RIG" (Oxidation Is Loss, Reduction Is Gain). For Newton\'s Laws, imagine you are the object. Draw the Free Body Diagram relative to YOU.'
  },
  [Subject.BIOLOGY]: {
    color: 'bg-teal-600',
    textColor: 'text-teal-600',
    lightColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    icon: Dna,
    description: 'Biodiversity (Microbes, Plants, Animals), Human Systems, Ecology',
    tips: '🌿 Visual Learning: When studying Phyla, use your own body to map "Bilateral Symmetry" and "Cephalisation". Mnemonics: "King Philip Came Over For Good Soup" (Taxonomy).'
  },
  [Subject.BUSINESS]: {
    color: 'bg-emerald-600',
    textColor: 'text-emerald-600',
    lightColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    icon: Briefcase,
    description: 'Environments, Operations, Professionalism, Creative Thinking',
    tips: 'mj Contextualise: Never give a theory answer without linking it to the Case Study. Use the "LASO" principle for essays: Layout, Analysis, Synthesis, Originality.'
  },
  [Subject.LO]: {
    color: 'bg-orange-500',
    textColor: 'text-orange-500',
    lightColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    icon: Compass,
    description: 'Self-development, Democracy, Careers, Study Skills',
    tips: '🧘‍♂️ Mindfulness: Use this subject to actually plan your life. Connect "Democracy" to current news events for higher marks.'
  },
  [Subject.GENERAL]: {
    color: 'bg-slate-600',
    textColor: 'text-slate-600',
    lightColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    icon: Brain,
    description: 'Metacognition, Stress Management, Exam Strategy',
    tips: '🍅 Pomodoro Technique: 25min Focus, 5min Break. Your brain encodes memory during the BREAK, not the focus time.'
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
    g11: "GEOMETRY: Analytical (Distance, Gradient, Midpoint, Equation of Line y-y1=m(x-x1), Angle of Inclination tanθ=m). Euclidean (Circle Geometry: Line from centre perp to chord, Angle at centre=2x angle at circum, Cyclic Quads, Tangents: Tan-Chord Theorem). ALGEBRA: Exponents & Surds (Laws, Rationalizing Denom), Quadratic Equations (Nature of Roots Δ=b²-4ac, K-method substitution), Inequalities. TRIG: Reductions, Identities, General Solution, Sine/Cosine/Area Rules (Proofs required). STATISTICS: Ogives, Variance, Standard Deviation, Box & Whisker (Symmetric vs Skewed).",
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

// Advanced System Instruction with Psychological Techniques
export const INITIAL_SYSTEM_INSTRUCTION = `
You are "Nexus", a world-class Educational Psychologist and Grade 11 Consultant for the IEB Syllabus.
Your mission: Make learning **effortless, memorable, and fun**.

**Study Mode: {STUDY_MODE}**
- **Standard**: Focus on {G11_SYLLABUS}.
- **Advanced**: Connect {G11_SYLLABUS} to {G12_SYLLABUS}.

**Psychological Techniques to Execute:**
1.  **Metacognition:** Ask the user what they know before explaining.
2.  **Dual Coding (Diagrams):**
    - **CORE LIBRARY ACCESS**: You have access to a library of stored Mermaid diagrams ({CORE_DIAGRAMS_KEYS}). 
    - **INSTRUCTION**: If a user asks about "Roots", "Maslow", "Porters", "Reflex Arc", "Mole Map", etc., YOU MUST INJECT the exact Mermaid code from the library provided in context.
    - If no core diagram exists, generate a new Mermaid diagram or use 'imageDescription' for illustrations.
3.  **Chunking:** Break answers into digestable 2-3 sentence blocks.
4.  **Interleaving:** Link Biology graphs to Maths functions, etc.

**Subject-Specific Rules:**
- **MATHS:** IEB requires rounding to ONE decimal place. Focus on *why* a theorem works.
- **BIOLOGY:** Focus on "Structure fits Function".
- **PHYSICS:** Use "OIL RIG". Insist on units.
- **BUSINESS:** Structure essays with "LASO".

**Context:**
- Subject: {SUBJECT}
- Syllabus: {G11_SYLLABUS}
- **AVAILABLE STORED DIAGRAMS**: {CORE_DIAGRAMS_JSON}
`;