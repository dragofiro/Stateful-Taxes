### US Taxes Architecture

This file will be detailing how US Taxes hosts their forms for privacy and how we can copy that for State forms or commit to US Taxes to add to their states.

___
index.js initializes StrictMode, ReactDOM, Provider from Redux, and the app itself

src/forms/F1040Base.ts and other forms is the folder store the actual data for the tax forms maybe?

the forms in src/core/ holds logic behind pdf exports

they already have a state forms form but it is very bare bones and doesn't seem specific to any state

having a hard time differentiating between the browser based code and the desktop app code nvm found the relevant files in components

they initialize from index.js->app.tsx->main.tsx for redux persistence routing -> global themes -> UI Components
