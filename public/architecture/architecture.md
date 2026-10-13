### Architecture
The architecture for this project relies on React to deploy the browser based app, and keeps information and pdf creation local so no data goes through us.

___

## File Structures
<pre>
.\
├── eslint.config.js
├── exit
├── index.html
├── LICENSE
├── notes.md
├── package.json
├── package-lock.json
├── public - contains pdf forms we are drawing from for comparison, architecture docs, [and other public forms]
│   └── architecture - contains architecture documents and artifacts
│   │   └── architecture.md
│   └── state_forms - contains forms for each year for each state
│       ├── YEAR - contains all of the forms for each state for that year
│       └── form_descriptions - contains form descriptions for every state's main personal income tax forms [IMPORTANT: If a state changes the name of the file, 
│                                                                                            only the most recent file name will be displayed in these documents]
├── README.md
├── src - contains react components
│   ├── App.css
│   ├── App.jsx
│   ├── assets
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── index.css
│   └── main.jsx
└── vite.config.js
</pre>

The goal for this project is to have a website that allows the user to choose a state, then choose their residence status with a link to how they can determine that status. The user will then be given a bunch of fill out forms that will clearly tell them what to input, and once all slots have been filled, the user will be able to export the data in the form of a pdf obtained from the state's tax website.

The project will be made using react, deployed with vercel, and using pdf-lib to export pdfs. A priority for the project is to, while achieving the goal stated above, also keeping as much of the process on the user's computer as possible to minimize the possibility of the user's data leaking to outside sources - there should be no permanent or long storage of user data in any part of the project (using local storage to store form responses is okay). 

Website UI: the main landing page describes the goal of the project and explains how the project manages everything locally and maintains user privacy as the highest priority. The main landing page also describes the states that the website supports (also includes a brief blurb about how Alaska, Tennessee, Wyoming, Florida, New Hampshire, South Dakota, Texas, Washington, and Nevada are states that do not have income taxes), then provides a link to choose a state to start (there should also be a brief blurb about multi residence taxes for people who reside or make money in multiple states, as some states are partnered to make submitting taxes easier or aren't partnered and require more forms). Once the user clicks the link to choosing a state, there will be a simple drop down menu that allows the user to choose which state, and once they choose that, they are prompted to choose full, part, or non resident, or self employed{/whoever needs to make more special payments based on circumstances}. once they choose their residence time, they are brought to a page that has a bunch of drop down forms to fill out with clear listings as to what each form wants (e.g. primary filer name, wages garnered this year, etc, but in plain english). Once the user fills out all of these forms, they will be able to either view the pdf, or immediately export it for their own use. In all pages of the website, there will be a warning that this way of filing is not always 100% correct and that we are not liable for any mistakes made on the tax forms, additionally, they should double check any form printed from this site for errors of any kind.