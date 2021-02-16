const API =
  "https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/@suparthnarayanghimire2014";

const loading = document.querySelector(".loading_skeleton");
fetchData(API);

function createBlogList(title, link) {
  const parent = document.querySelector(".about-us-list");
  const list = document.createElement("li");

  list.classList.add("points");
  list.innerHTML = `<a href="${link}" target="_blank">${title}</a>`;
  parent.appendChild(list);
}

function parseData(data) {
  const parent = document.querySelector(".about-us-list");
  parent.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    createBlogList(data.items[i].title, data.items[i].link);
  }
}

async function fetchData(API) {
  try {
    const response = await fetch(API);
    const data = await response.json();
    parseData(data);
  } catch (e) {
    console.error(e);
  }
}
