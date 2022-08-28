import { getActiveTabURL } from "../utils.js";

const keywordClassNames = [
  "bg-gray-300",
  "rounded-xl",
  "p-2",
  "mr-2",
  "text-md",
];

const viewDashboard = () => {
  const keywordsListElement = document.getElementById("keywords-list");
  if (!keywordsListElement) {
    console.error("keywordsListElement not found");
    return;
  };
  keywordsListElement.innerHTML = "";

  const keywords = [];

  for (const keyword of keywords) {
    const keywordElement = document.createElement("span");
    keywordElement.innerText = keyword;
    for (const cls of keywordClassNames) {
      keywordElement.classList.add(cls);
    }
    keywordsListElement.appendChild(keywordElement);
  }

  const similarJudgements = [
    {
      judgement_id: "108,台上大,2470",
      court_level: "最高法院",
      result: "win",
      link: "https://lawsnote.com/judgement/60910dbb38dd6d89045ae8d6?t=1643964315",
    },
    {
      judgement_id: "111,台上,1274",
      court_level: "最高法院",
      result: "win",
      link: "https://lawsnote.com/judgement/62e7e1568b4ccbb5c0b2f005?t=1643964315",
    },
    {
      judgement_id: "111,台上,1805",
      court_level: "最高法院",
      result: "win",
      link: "https://lawsnote.com/judgement/62e8bea78b4ccbb5c0eb2576?t=1643964315",
    },
    {
      judgement_id: "111,台上,1401",
      court_level: "最高法院",
      result: "lose",
      link: "https://lawsnote.com/judgement/62edfa0d8b4ccbb5c073939c?t=1643964315",
    },
    {
      judgement_id: "111,台抗,602",
      court_level: "最高法院",
      result: "lose",
      link: "https://lawsnote.com/judgement/62f1fada8b4ccbb5c0e2fcb6?t=1643964315",
    },
    {
      judgement_id: "111,台上,526",
      court_level: "最高法院",
      result: "lose",
      link: "https://lawsnote.com/judgement/62e23fe98b4ccbb5c0a3b7ae?t=1643964315",
    },
  ];

  const similarJudgementsWinListElement = document.getElementById(
    "similar_judgements_win_list"
  );
  // @ts-ignore
  similarJudgementsWinListElement.innerHTML = "";

  // Render Winning judgements
  similarJudgements
    .filter((similarJudgement) => similarJudgement.result === "win")
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
    .filter((similarJudgement) => similarJudgement.result === "lose")
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
    console.log("viewing dashboard");
    viewDashboard();
  } else {
    const container = document.getElementById("body");
    // @ts-ignore
    container.innerHTML =
      '<div class="text-lg text-center text-bold p-6">This is not a Lawsnote judgement page.</div>';
  }
});
