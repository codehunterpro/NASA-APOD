const imagesContainer = document.querySelector(".images-container");
const resultsNav = document.getElementById("resultsNav");
const favouritsNav = document.getElementById("favouritesNav");
const saveConfirmed = document.querySelector(".save-confirmed");
const addBtn = document.querySelectorAll(".add-btn");
const favourite = document.querySelector(".add-favourite");
const checkBookmarked = document.querySelector(".check-bookmarked");
const loader = document.querySelector(".loader");

const apiKey = `Y5mfOTJKHtH7d6KhwsQBfC6uvo8J6JS3METcei7F`;
const count = 10;
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let bookMarked = false;
let dataArray = [];
let addBookmarks = {};

function showContent(page) {
  window.scrollTo({ top: 0, behavior: "instant" });
  if (page === "dataArray") {
    resultsNav.classList.remove("hidden");
    favouritsNav.classList.add("hidden");
  } else {
    resultsNav.classList.add("hidden");
    favouritsNav.classList.remove("hidden");
  }
  loader.classList.add("hidden");
}

function createDOMNodes(page) {
  const currentArray =
    page === "dataArray" ? dataArray : Object.values(addBookmarks);

  currentArray.forEach((dataObj) => {
    const card = document.createElement("div");
    card.classList.add("card");
    //  for image
    const anchor = document.createElement("a");
    anchor.href = dataObj.url;
    anchor.title = "View Full Image";
    const image = document.createElement("img");
    image.classList.add("card-img-top");
    image.setAttribute("src", dataObj.hdurl);
    image.title = "Full Image ";
    anchor.append(image);

    // for card body
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = dataObj.title;

    cardBody.append(cardTitle);

    const addFavourite = document.createElement("p");
    addFavourite.classList.add("clickable");

    if (page === "dataArray") {
      addFavourite.textContent = "Add to Favourite";
      addFavourite.setAttribute("onclick", `addBookmark('${dataObj.url}')`);
    } else {
      addFavourite.textContent = "Remove Favourite";
      addFavourite.setAttribute("onclick", `removeBookmark('${dataObj.url}')`);
    }

    cardBody.append(addFavourite);

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = dataObj.explanation;

    const small = document.createElement("small");
    small.classList.add("muted");

    const strongText = document.createElement("strong");
    strongText.textContent = dataObj.date;
    const spanCopyRight = document.createElement("span");
    spanCopyRight.textContent = ` ${
      dataObj.copyright ? dataObj.copyright : "---"
    }`;

    small.append(strongText);
    small.append(spanCopyRight);

    cardBody.append(cardTitle);
    cardBody.append(addFavourite);
    cardBody.append(cardText);
    cardBody.append(small);

    card.append(anchor);
    card.append(cardBody);
    imagesContainer.append(card);
  });
}

// Update DOM Elemente
function updateDOM(page) {
  if (localStorage.getItem("bookmarks")) {
    addBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
  }
  imagesContainer.textContent = "";
  createDOMNodes(page);
  showContent(page);
}

function addBookmark(url) {
  // Loop through Results Array to select Favorite
  dataArray.forEach((item) => {
    if (item.url.includes(url) && !addBookmarks[url]) {
      addBookmarks[url] = item;
      // Show Save Confirmation for 2 seconds
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);
      // Set Favorites in localStorage
      localStorage.setItem("bookmarks", JSON.stringify(addBookmarks));
    }
  });
}

function removeBookmark(url) {
  if (addBookmarks[url]) {
    delete addBookmarks[url];

    localStorage.setItem("bookmarks", JSON.stringify(addBookmarks));
    updateDOM("addBookmarks");
  }
}

// function updateFavouriteDOM() {
//   addBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
// }

async function getNASAphotos() {
  // show loader
  loader.classList.remove("hidden");
  try {
    const response = await fetch(apiUrl);
    dataArray = await response.json();

    // Call UpdateDOM Function
    updateDOM("dataArray");
  } catch (error) {
    // Show Error Here
    console.error(error.message);
  }
}

// On Load....
getNASAphotos();
