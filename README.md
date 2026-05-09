# Objectives
This is a web extension that should record the dom events/updates, network intents and user actions for a web application (espcially a SPA) recording all the observables as a linear reproducable webflow written as a json.
## Functional Requirements
- [ ] Make a simple web extension
- [ ] Record all dom events/updates, 
- [ ] Record all network intents 
- [ ] Record all user actions
- [ ] Package all the observables in a linear reproducable webflow json doc
- [ ] How to save that json doc on the user's local machine
## Improvements and Extensions
- [ ] Go Backend that spins up an agent compatible with OpenAI api shapes
- [ ] Build custom tool mcp with multiple webflow json docs
- [ ] Build a harness and contenxt manager to run the webflow json docs by the agent independently in a chromium/puppeteer.
- [ ] Auth for the web-extension using github app.
- [ ] Signed json docs webflows that can be verified by the web-extension and shared between peers
- [ ] Teams Auth and collaboration