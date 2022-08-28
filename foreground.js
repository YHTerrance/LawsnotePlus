// This script gets injected into any opened page
// whose URL matches the pattern defined in the manifest
// (see "content_script" key).
// Several foreground scripts can be declared
// and injected into the same or different pages.

(() => {
  let currentNo = "";
  let currentKeywords = [];
  let currentSimilarJudgements = [];
  let currentOutcome;
  let currentMetaContent;

  // const fetchBookmarks = () => {
  //   return new Promise((resolve) => {
  //     chrome.storage.sync.get([currentVideo], (obj) => {
  //       resolve(obj[currentVideo] ? JSON.parse(obj[currentVideo]) : []);
  //     });
  //   });
  // };

  // const addNewBookmarkEventHandler = async () => {
  //   const currentTime = youtubePlayer.currentTime;
  //   const newBookmark = {
  //     time: currentTime,
  //     desc: "Bookmark at " + getTime(currentTime),
  //   };

  //   currentVideoBookmarks = await fetchBookmarks();

  //   chrome.storage.sync.set({
  //     [currentVideo]: JSON.stringify([...currentVideoBookmarks, newBookmark].sort((a, b) => a.time - b.time))
  //   });
  // };

  const newJudgementLoaded = () => {
    console.log(document);
    console.log(document.title);
    currentMetaContent = document.getElementsByClassName("document__meta-content")[0];
    console.log(currentMetaContent);
  };

  // @ts-ignore
  chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type } = obj;

    if (type === "NEW") {
      console.log("on message: NEW");
      newJudgementLoaded();
    }
    // else if (type === "PLAY") {
    //   youtubePlayer.currentTime = value;
    // } else if (type === "DELETE") {
    //   currentVideoBookmarks = currentVideoBookmarks.filter((b) => b.time != value);
    //   chrome.storage.sync.set({ [currentVideo]: JSON.stringify(currentVideoBookmarks) });

    //   response(currentVideoBookmarks);
    // }
  });

  console.log("Run it after 10 seconds");
  setTimeout(() => { newJudgementLoaded() }, 10);
})();

