// @ts-nocheck
import { getActiveTabURL } from "../utils.js";

const renderKeywords = (keywords) => {
  const keywordsListElement = document.getElementById("keywords-list");
  if (!keywordsListElement) {
    console.error("keywordsListElement not found");
    return;
  };
  keywordsListElement.innerHTML = "";

  for (const keyword of keywords.slice(0, 10)) {
    const keywordElement = document.createElement("span");
    keywordElement.innerText = keyword;
    keywordElement.classList.add("bg-gray-300", "rounded-xl", "p-2", "mr-2", "mb-2", "text-md", "inline-block");
    keywordsListElement.appendChild(keywordElement);
  }
}

const createSimilarJudgementsElements = (similarJudgements, topK = 3) => {
  const elements = [];
  for (const similarJudgement of similarJudgements.slice(0, topK)) {
    const listElement = document.createElement("li");
    listElement.className = "mb-2";
    const similarJudgementElement = document.createElement("a");
    similarJudgementElement.classList.add("underline", "underline-offset-2");
    similarJudgementElement.href = similarJudgement.link;
    similarJudgementElement.innerText = `${similarJudgement.court_level} ${similarJudgement.judgement_id}`;
    listElement.appendChild(similarJudgementElement);
    elements.push(listElement);
  }
  return elements;
}

const renderSimilarJudgements = (similarJudgements) => {

  // Render Winning judgements
  const similarJudgementsWinListElement = document.getElementById(
    "similar_judgements_win_list"
  );
  // @ts-ignore
  similarJudgementsWinListElement.innerHTML = "";
  const winJudgements = similarJudgements
    .filter((similarJudgement) => similarJudgement.result === "Win")
    .sort((a, b) => b.similarity - a.similarity);
  const winJudgementsElements = createSimilarJudgementsElements(winJudgements);
  for (const e of winJudgementsElements) {
    similarJudgementsWinListElement.appendChild(e);
  }

  // Render losing judgements
  const similarJudgementsLoseListElement = document.getElementById(
    "similar_judgements_lose_list"
  );
  // @ts-ignore
  similarJudgementsLoseListElement.innerHTML = "";
  const loseJudgements = similarJudgements
    .filter((similarJudgement) => similarJudgement.result === "Lose")
    .sort((a, b) => b.similarity - a.similarity);
  const loseJudgementsElements = createSimilarJudgementsElements(loseJudgements);
  for (const e of loseJudgementsElements) {
    similarJudgementsLoseListElement.appendChild(e);
  }
}

const viewDashboard = async (no = "", keywords = [], winningSimilarJudgements = [], losingSimilarJudgements = [], winningPercentage = 0, outcome = "", similarJudgementCount = 0) => {

  renderKeywords(keywords);

  // Sample format:
  //   {
  //     judgement_id: "110,台上,1877",
  //     court_level: "最高法院",
  //     result: "win",
  //     link: "https://lawsnote.com/judgement/60910dbb38dd6d89045ae8d6?t=1643964315",
  //   }
  const similarJudgements = [...winningSimilarJudgements, ...losingSimilarJudgements].map((data) => {
    const outcome = data[2] === 3 ? "Unknown" : data[2] === 2 ? "Partial Win" : data[2] === 1 ? "Win" : "Lose";
    return {
      judgement_id: data[0],
      similarity: data[1],
      court_level: "最高法院",
      result: outcome,
      link: ""
    };
  });
  console.log(similarJudgements);

  renderSimilarJudgements(similarJudgements);

  const similarJudgementCountElement = document.getElementById("similar_judgement_count");
  similarJudgementCountElement.innerText = similarJudgementCount;
  const winningPercentageElement = document.getElementById("winning_percentage");
  winningPercentageElement.innerText = `${Math.round(winningPercentage * 100 * 100) / 100}%`;
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
        await viewDashboard(_currentNo, res.keywords, res.winningSimilarJudgements, res.losingSimilarJudgements, res.winningPercentage, res.outcome, res.similarJudgementCount);
      })
    })

  } else {
    const container = document.getElementById("body");
    // @ts-ignore
    container.innerHTML =
      '<div class="text-lg text-center text-bold p-6">This is not a Lawsnote judgement page.</div>';
  }
});
