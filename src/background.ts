// Listen for extension icon clicks (action click)
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: "toggle-overlay" })
    } catch (error) {
      console.log("Content script not available on this page")
    }
  }
})

// Optional: Listen for keyboard shortcuts (only if you add commands to manifest)
if (chrome.commands) {
  chrome.commands.onCommand.addListener(async (command) => {
    if (command === "toggle-overlay") {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
      
      if (tab?.id) {
        try {
          await chrome.tabs.sendMessage(tab.id, { action: "toggle-overlay" })
        } catch (error) {
          console.log("Content script not available on this page")
        }
      }
    }
  })
}

// Optional: Add context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "toggle-overlay",
    title: "Toggle Extension Overlay",
    contexts: ["page"]
  })
})

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "toggle-overlay" && tab?.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, { action: "toggle-overlay" })
    } catch (error) {
      console.log("Content script not available on this page")
    }
  }
})