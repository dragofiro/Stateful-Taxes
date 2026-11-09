# Stateful-Taxes
___
## What is Stateful Taxes?
Stateful Taxes is an open-source project dedicated to providing free, open-source tax filing for state level taxes across America.

There are a lot of options for US citizens to file their federal taxes for free. Despite this, there is still no way to file state taxes in an easy, digital, and free (as in beer) way. We are dedicated to making a free, comprehensive, state-tax filing service that works for all 50 states, and as many US territories as possible, while keeping personal information out of the equation.

The tax forms that we use are drawn directly from the state websites listed on [taxadmin.org](https://taxadmin.org/state-tax-forms/) and can be checked at any time by going to the state_forms folder, and finding your state and file.

This project is deployed through [Netlify](https://www.netlify.com/).
___
### User Guide
Important: This project is not officially licensed by the IRS or any US governmental service. This project is not meant to complete electronic filing, and will only give users a printable pdf that can be mailed in for state tax returns. 

This project keeps all information local to your computer and will never take any information outside of your computer. To make recovering your progress easier in the event of a user working on multiple computers, we have added a json download option to allow users to store their in progress forms or last years forms to instantly repopulate most of the basic fields.

To use this project for viewing and selecting files to print and fill out by hand, go to the state_forms folder, select your state, and open the state_name.md file. Each .md file contains a brief description of every form for that state as well as who should be using this form (Full vs Part vs Non Residents). 
### Landing page map
The landing page map and state flags are static files in the repo, so the page sends no request to any outside server. You only need to rebuild them if the map or a flag changes.

To rebuild the map outlines in `src/components/landing/us_map_data.ts`, run `npm run assets:landing`.

To rebuild the flags in `public/flags/`, put the flag SVGs in one folder (named `us-co.svg`, `us-tx.svg` and so on) and run `npm run assets:landing -- path/to/folder`.
