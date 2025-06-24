let startTime = 0;
let endTime = 0;
let loopMode = false;
let isActive = false;

console.log("YouTube Trimmer content script injected.");

chrome.runtime.onMessage.addListener((request) => {
  const video = document.querySelector('video');
  if (!video) return;

  if (request.type === "SET_TIME") {
    startTime = request.start;
    endTime = request.end;
    loopMode = request.loop;
    isActive = true;

    video.pause();
    video.currentTime = startTime;

    video.addEventListener("seeked", function onSeekedStart() {
      video.removeEventListener("seeked", onSeekedStart);
      video.play();
    });

    const loopChecker = setInterval(() => {
      if (!isActive || !loopMode) {
        clearInterval(loopChecker);
        return;
      }

      if (video.currentTime >= endTime) {
        video.pause();
        video.addEventListener("seeked", function onSeekedLoop() {
          video.removeEventListener("seeked", onSeekedLoop);

          const waitToPlay = () => {
            if (video.readyState >= 2) {
              video.play();
            } else {
              setTimeout(waitToPlay, 100);
            }
          };

          setTimeout(waitToPlay, 150);
        });

        video.currentTime = startTime;
      }
    }, 250);

    video.addEventListener("seeking", function onUserSeek() {
      const cur = video.currentTime;
      if (cur < startTime - 1 || cur > endTime + 1) {
        isActive = false;
        clearInterval(loopChecker);
        video.removeEventListener("seeking", onUserSeek);
        console.log("User seek out of range. Trimmer is turned off.");
      }
    });

  } else if (request.type === "STOP_TRIMMER") {
    isActive = false;
    console.log("The trimmer is turned off manually.");
  }
});
