export async function getActiveTabURL() {
  // @ts-ignore
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    active: true,
  });
  return tabs[0];
}
