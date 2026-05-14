# Objectives
This is a web extension that should record the dom events/updates, network intents and user actions for a web application (espcially a SPA) recording all the observables as a linear reproducable webflow written as a json.
## Functional Requirements
- [x] Make a simple web extension with a popup having a 'Ready to record' button
- [x] Make the web extension to be able to display a floating record button when the user clicks ready to record on the extension popup by injecting scripts into the active tab.
- [ ] Save an initial DOM Snapshot of the page after the user toggles record. [Refer Offscreen as Service Workers don't have DOM access] (https://developer.chrome.com/docs/extensions/reference/api/offscreen)
- [ ] Record all dom events/updates using content scripts.
- [ ] Record all network intents using content scripts.
- [ ] Record all user actions using content scripts.
- [ ] Package all the observables in a linear reproducable webflow json doc
- [ ] How to save that json doc on the user's local machine
## Improvements and Extensions
- [ ] Go Backend that spins up an agent compatible with OpenAI api shapes
- [ ] Build custom tool mcp with multiple webflow json docs
- [ ] Build a harness and contenxt manager to run the webflow json docs by the agent independently in a chromium/puppeteer.
- [ ] Auth for the web-extension using github app.
- [ ] Signed json docs webflows that can be verified by the web-extension and shared between peers
- [ ] Teams Auth and collaboration
