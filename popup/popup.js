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
  keywordsListElement.innerHTML = "";
  const keywords = ["債權行為", "物權行為", "所有權"];

  keywords.forEach((keyword) => {
    const keywordElement = document.createElement("span");
    keywordElement.innerText = keyword;
    for (const cls of keywordClassNames) {
      keywordElement.classList.add(cls);
    }
    keywordsListElement.appendChild(keywordElement);
  });
};

document.addEventListener("DOMContentLoaded", async () => {
  const activeTab = await getActiveTabURL();

  if (activeTab.url.includes("lawsnote.com/judgement")) {
    console.log("viewing dashboard");
    viewDashboard();
  } else {
    const container = document.getElementsByClassName("container");
    container.innerHTML =
      '<div class="text-xl">This is not a lawsnote judgement page.</div>';
  }
});
