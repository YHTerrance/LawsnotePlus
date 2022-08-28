// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

(() => {
  const hostName = "http://meow1.csie.ntu.edu.tw:8888"
  let currentNo = "";
  let currentKeywords = [];
  let currentSimilarJudgements = [];
  let currentOutcome;

  const newJudgementLoadedWrapper = (evt) => {

    const newJudgementLoaded = async () => {
      if (document.getElementsByClassName("document__meta-content")[0]) {
        clearInterval(jsInitChecktimer);

        // Get current judgement id (example format "【裁判字號】108,台上大,2470")
        // @ts-ignore
        currentNo = document.getElementsByClassName("document__meta-content")[0].firstChild.innerText.split(" ")[0].substring(6);
        console.log("judgement id: " + currentNo);

        const res = await fetch(`${hostName}/judgement/${currentNo}`);
        const data = await res.json();
        console.log("judgement info: ", data);

        currentKeywords = data.output.keywords.keywords;
        currentSimilarJudgements = data.output.similar_judgements;
        currentOutcome = data.output.outcome === 3 ? "Unknown"
          : data.output.outcome === 2 ? "Partial Win"
            : data.output.outcome === 1 ? "Win" : "Lose";

        console.log("current keywords: ", currentKeywords);
        console.log("current similar judgements: ", currentSimilarJudgements);
        console.log("current outcome: ", currentOutcome);

        // @ts-ignore
        chrome.storage.sync.set({
          ["currentNo"]: currentNo,
        })
        // @ts-ignore
        chrome.storage.sync.set({
          [currentNo]: JSON.stringify(data)
        });
      }
    };

    var jsInitChecktimer = setInterval(newJudgementLoaded, 100);
  }

  // @ts-ignore
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;

    if (type === "NEW") {
      console.log("on message: NEW");
      newJudgementLoadedWrapper();
    }
  });

  window.addEventListener("load", newJudgementLoadedWrapper, false);
})();

