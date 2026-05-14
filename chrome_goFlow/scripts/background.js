import "./modules/dom_snapshot_recorder.js";
import "./modules/network_intent_recorder.js";

/** Opaque RGBA tuples — Chrome often rejects CSS named colors like "grey" for badges. */
const BADGE_RGBA_OFF = [128, 128, 128, 255];
const BADGE_RGBA_ON = [255, 0, 0, 255];

/** Path relative to extension root; used with chrome.action.setPopup (not getURL). */
const ERROR_POPUP_PATH = "static/error_popup.html";

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === "clearToolbarPopup") {
    const tabId = message.tabId;
    if (typeof tabId === "number") {
      chrome.action.setPopup({ tabId, popup: "" });
    } else {
      chrome.action.setPopup({ popup: "" });
    }
  }
});

// set some initial state save in the local storage
// on click chrome action see the change in the state in background I will need to setup the listeners separately from each of the above scripts

// sane defaults on install
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.session.set({
    applicationState: "OFF",
    activeTabId: null,
    initialBadgeText: "OFF",
    initialBadgeColor: BADGE_RGBA_OFF,
  });
  const { initialBadgeText, initialBadgeColor } =
    await chrome.storage.session.get(["initialBadgeText", "initialBadgeColor"]);
  await chrome.action.setBadgeText({ text: initialBadgeText ?? "OFF" });
  await chrome.action.setBadgeBackgroundColor({
    color:
      Array.isArray(initialBadgeColor) && initialBadgeColor.length === 4
        ? initialBadgeColor
        : BADGE_RGBA_OFF,
  });
  await chrome.action.setPopup({ popup: "" });
});

let applicationState = "OFF";
let activeTabId = null;

async function hydrateToolbarStateFromSession() {
  const data = await chrome.storage.session.get([
    "applicationState",
    "activeTabId",
  ]);
  if (data.applicationState === "ON" || data.applicationState === "OFF") {
    applicationState = data.applicationState;
  }
  if (Object.prototype.hasOwnProperty.call(data, "activeTabId")) {
    activeTabId =
      typeof data.activeTabId === "number" ? data.activeTabId : null;
  }
}

async function persistToolbarState() {
  await chrome.storage.session.set({ applicationState, activeTabId });
}

chrome.action.onClicked.addListener(async (tab) => {
  await hydrateToolbarStateFromSession();
  console.log(applicationState, activeTabId);
  if (
    applicationState === "ON" &&
    (activeTabId === null || activeTabId != tab.id)
  ) {
    console.log("error popup", tab.id, activeTabId);
    const popupPath = `${ERROR_POPUP_PATH}#${tab.id}`;
    await chrome.action.setPopup({ tabId: tab.id, popup: popupPath });
    await chrome.action.openPopup();
  } else if (applicationState === "OFF") {
    console.log("on", tab.id, activeTabId);
    applicationState = "ON";
    activeTabId = tab.id;
    await persistToolbarState();
    chrome.action.setBadgeText({
      text: applicationState,
      tabId: activeTabId,
    });
    chrome.action.setBadgeBackgroundColor({
      color: BADGE_RGBA_ON,
      tabId: activeTabId,
    });
  } else if (applicationState === "ON" && activeTabId === tab.id) {
    console.log("off", tab.id, activeTabId);
    const recordingTabId = tab.id;
    applicationState = "OFF";
    activeTabId = null;
    await persistToolbarState();
    chrome.action.setBadgeText({
      text: applicationState,
      tabId: recordingTabId,
    });
    chrome.action.setBadgeBackgroundColor({
      color: BADGE_RGBA_OFF,
      tabId: recordingTabId,
    });
  }
});
