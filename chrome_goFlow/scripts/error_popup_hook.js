function toolbarTabIdFromLocation() {
  const m = /^#(\d+)$/.exec(window.location.hash || "");
  return m ? Number(m[1]) : undefined;
}

function sendClearToolbarPopup() {
  const tabId = toolbarTabIdFromLocation();
  chrome.runtime.sendMessage(
    tabId != null
      ? { type: "clearToolbarPopup", tabId }
      : { type: "clearToolbarPopup" },
  );
}

window.addEventListener("pagehide", sendClearToolbarPopup);
