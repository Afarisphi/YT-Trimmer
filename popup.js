function timeToSeconds(timeStr) {
  const [min, sec] = timeStr.split(":").map(Number);
  return (min || 0) * 60 + (sec || 0);
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

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["startInput", "endInput", "loopEnabled"], (data) => {
    if (data.startInput) document.getElementById("start").value = data.startInput;
    if (data.endInput) document.getElementById("end").value = data.endInput;

    if (data.startInput && data.endInput) {
      document.getElementById("currentRange").textContent =
        `Active Trimmer : ${data.startInput} → ${data.endInput}`;
    }

    document.getElementById("loop").checked = !!data.loopEnabled;
  });
});

document.getElementById("apply").addEventListener("click", () => {
  const startInput = document.getElementById("start").value;
  const endInput = document.getElementById("end").value;
  const loop = document.getElementById("loop").checked;

  if (!startInput || !endInput) {
    alert("Enter the start and end time first.");
    return;
  }

  const start = timeToSeconds(startInput);
  const end = timeToSeconds(endInput);

  chrome.storage.local.set({
    startInput,
    endInput,
    loopEnabled: loop
  });

  document.getElementById("currentRange").textContent =
    `Active Trimmer : ${startInput} → ${endInput}`;

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

  sendMessageToContent({ type: "STOP_TRIMMER" });
});
