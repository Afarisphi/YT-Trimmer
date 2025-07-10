function timeToSeconds(timeStr) {
  const parts = timeStr.split(":").map(Number);
  if (parts.length === 3) {
    const [h, m, s] = parts;
    return (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
  } else if (parts.length === 2) {
    const [m, s] = parts;
    return (m || 0) * 60 + (s || 0);
  } else if (parts.length === 1) {
    return Number(parts[0]) || 0;
  }
  return 0;
}

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${m}:${String(s).padStart(2, '0')}`;
}

function sendMessageToContent(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url.includes("youtube.com/watch")) {
      alert("Please open the YouTube video page first.");
      return;
    }
    chrome.tabs.sendMessage(tab.id, message);
  });
}

function updateCurrentVideoTime() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    if (!tab || !tab.url.includes("youtube.com/watch")) return;

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const video = document.querySelector('video');
        return video ? video.currentTime : null;
      }
    }, (results) => {
      if (chrome.runtime.lastError || !results || results.length === 0) return;
      const time = results[0].result;
      if (typeof time === "number") {
        document.getElementById("videoTime").textContent = `Current Time: ${formatTime(time)}`;
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["startInput", "endInput", "loopEnabled"], (data) => {
    if (data.startInput) document.getElementById("start").value = data.startInput;
    if (data.endInput) document.getElementById("end").value = data.endInput;

    if (data.startInput && data.endInput) {
      document.getElementById("currentRange").textContent =
        `Active Trimmer: ${data.startInput} → ${data.endInput}`;
    }

    document.getElementById("loop").checked = !!data.loopEnabled;
  });

  setInterval(updateCurrentVideoTime, 1000);
});

document.getElementById("apply").addEventListener("click", () => {
  const startInput = document.getElementById("start").value.trim();
  const endInput = document.getElementById("end").value.trim();
  const loop = document.getElementById("loop").checked;

  if (!startInput || !endInput) {
    alert("Enter the start and end time first.");
    return;
  }

  const start = timeToSeconds(startInput);
  const end = timeToSeconds(endInput);

  if (isNaN(start) || isNaN(end) || start >= end) {
    alert("The time format is incorrect or the start is greater than the end.");
    return;
  }

  chrome.storage.local.set({
    startInput,
    endInput,
    loopEnabled: loop
  });

  document.getElementById("currentRange").textContent =
    `Trimmer aktif: ${startInput} → ${endInput}`;

  sendMessageToContent({
    type: "SET_TIME",
    start,
    end,
    loop
  });
});

document.getElementById("stop").addEventListener("click", () => {
  chrome.storage.local.remove(["startInput", "endInput", "loopEnabled"]);
  document.getElementById("start").value = "";
  document.getElementById("end").value = "";
  document.getElementById("loop").checked = false;
  document.getElementById("currentRange").textContent = "";
  document.getElementById("videoTime").textContent = "Current Time: --:--";

  sendMessageToContent({ type: "STOP_TRIMMER" });
});
