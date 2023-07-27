
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.url || changeInfo.status === 'complete') {
    const url = changeInfo.url;
    const isPhishingSite = await checkPhishingSite(url);
    if (isPhishingSite) {
      chrome.action.setIcon({ tabId, path: 'warning-48.png' });
      chrome.action.setBadgeText({ tabId, text: 'Phishing' });
      chrome.notifications.create({
        type: "basic",
        iconUrl: "warning-48.png",
        title: "Phishing Site Checker",
        message: "The website you visited is recognized as Phishing Site you will be redirected.",
      });
      await chrome.tabs.update(tab.id, { url: "https://example.com/safe-page" });
    } else {
      chrome.action.setIcon({ tabId, path: 'default-icon-48.png' });
      chrome.action.setBadgeText({ tabId, text: 'clean' });
      console.log('clean site');
    }
  }
});

async function checkPhishingSite(url) {
  const apiKey = 'AIzaSyA2VYy5fu7aq3EXjMGTudAeTcOzSe_JhJ4'; // Get your API key from the Google Cloud Console
  const encodedUrl = encodeURIComponent(url);
  const apiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;
  const body = JSON.stringify({
    client: {
      clientId: 'YourClientID',
      clientVersion: '1.0'
    },
    threatInfo: {
      threatTypes: ['THREAT_TYPE_UNSPECIFIED', 'SOCIAL_ENGINEERING', 'MALWARE', 'UNWANTED_SOFTWARE', 'POTENTIALLY_HARMFUL_APPLICATION'],
      platformTypes: ['ANY_PLATFORM'],
      threatEntryTypes: ['URL'],
      threatEntries: [
        { url: encodedUrl }
      ]
    }
  });

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    });

    const data = await response.json();
    return data.matches && data.matches.length > 0;
    
  } catch (error) {
    console.error('Error checking phishing site:', error);
    return false;
  }
}