// @ts-nocheck
import { getActiveTabURL } from "../utils.js";

const viewDashboard = async (currentNo = "", currentKeywords = [], currentSimilarJudgements = [], currentOutcome = []) => {
  const keywordsListElement = document.getElementById("keywords-list");
  if (!keywordsListElement) {
    console.error("keywordsListElement not found");
    return;
  };
  keywordsListElement.innerHTML = "";

  for (const keyword of currentKeywords.slice(0, 10)) {
    const keywordElement = document.createElement("span");
    keywordElement.innerText = keyword;
    keywordElement.classList.add("bg-gray-300", "rounded-xl", "p-2", "mr-2", "mb-2", "text-md", "inline-block");
    keywordsListElement.appendChild(keywordElement);
  }

  // Sample format:
  //   {
  //     judgement_id: "110,台上,1877",
  //     court_level: "最高法院",
  //     result: "win",
  //     link: "https://lawsnote.com/judgement/60910dbb38dd6d89045ae8d6?t=1643964315",
  //   }
  const similarJudgements = await Promise.all(currentSimilarJudgements.map(async (currentSimilarJudgement) => {
    const res = await fetch(`http://meow1.csie.ntu.edu.tw:8888/judgement/${currentSimilarJudgement[0]}/outcome`);
    const data = await res.json();
    const outcome = data.output === 3 ? "Unknown" : data.output === 2 ? "Partial Win" : data.output === 1 ? "Win" : "Lose";

    return {
      judgement_id: currentSimilarJudgement[0],
      court_level: "最高法院",
      result: outcome,
      link: ""
    };
  }));
  console.log(similarJudgements);

  const similarJudgementsWinListElement = document.getElementById(
    "similar_judgements_win_list"
  );
  // @ts-ignore
  similarJudgementsWinListElement.innerHTML = "";

  // Render Winning judgements
  similarJudgements
    .filter((similarJudgement) => similarJudgement.result === "Win")
    .forEach((similarJudgement) => {
      const listElement = document.createElement("li");
      listElement.className = "mb-2";
      const similarJudgementElement = document.createElement("a");
      similarJudgementElement.classList.add("underline", "underline-offset-2");
      similarJudgementElement.href = similarJudgement.link;
      similarJudgementElement.innerText = `${similarJudgement.court_level} ${similarJudgement.judgement_id}`;
      listElement.appendChild(similarJudgementElement);
      // @ts-ignore
      similarJudgementsWinListElement.appendChild(listElement);
    });

  // Render losing judgements
  const similarJudgementsLoseListElement = document.getElementById(
    "similar_judgements_lose_list"
  );
  // @ts-ignore
  similarJudgementsLoseListElement.innerHTML = "";

  similarJudgements
    .filter((similarJudgement) => similarJudgement.result === "Lose")
    .forEach((similarJudgement) => {
      const listElement = document.createElement("li");
      listElement.className = "mb-2";
      const similarJudgementElement = document.createElement("a");
      similarJudgementElement.classList.add("underline", "underline-offset-2");
      similarJudgementElement.href = similarJudgement.link;
      similarJudgementElement.innerText = `${similarJudgement.court_level} ${similarJudgement.judgement_id}`;
      listElement.appendChild(similarJudgementElement);
      // @ts-ignore
      similarJudgementsLoseListElement.appendChild(listElement);
    });
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();
  if (activeTab.url && activeTab.url.includes("lawsnote.com/judgement")) {
    // @ts-ignore
    chrome.storage.sync.get(["currentNo"], (data) => {
      const _currentNo = data.currentNo;
      chrome.storage.sync.get([_currentNo], async (data) => {
        const res = data[_currentNo] ? JSON.parse(data[_currentNo]) : {};
        console.log(res);
        console.log("viewing dashboard");
        if (res.status === "Success") {
          await viewDashboard(_currentNo, res.output.keywords.keywords, res.output.similar_judgements, res.output.outcome);
        }
      })
    })

  } else {
    const container = document.getElementById("body");
    // @ts-ignore
    container.innerHTML =
      '<div class="text-lg text-center text-bold p-6">This is not a Lawsnote judgement page.</div>';
  }
});
