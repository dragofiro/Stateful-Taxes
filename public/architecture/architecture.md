### Architecture
The architecture for this project relies on React to deploy the browser based app, and keeps information and pdf creation local so no data goes through us.

___

## File Structures
.\
├── eslint.config.js\
├── exit\
├── index.html\
├── LICENSE\
├── notes.md\
├── package.json\
├── package-lock.json\
├── public - contains pdf forms we are drawing from for comparison, architecture docs, [and other public forms]\
│   └── architecture - contains architecture documents and artifacts\
│   │   └── architecture.md\
│   └── state_forms - contains forms for each year for each state\
│       ├── YEAR - contains all of the forms for each state for that year\
│       └── form_descriptions - contains form descriptions for every state's main personal income tax forms.
├── README.md\
├── src - contains react components\
│   ├── App.css\
│   ├── App.jsx\
│   ├── assets\
│   │   ├── react.svg\
│   │   └── vite.svg\
│   ├── index.css\
│   └── main.jsx\
└── vite.config.js\