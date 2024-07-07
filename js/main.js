const title = document.getElementById("latest-title");
const date = document.getElementById("latest-date");
const text = document.getElementById("latest-text");

fetch("../latest.xml")
    .then((response) => response.text())
    .then((xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const post = xmlDoc.querySelector("post");
        title.textContent = post.querySelector("title").textContent;
        date.textContent = post.querySelector("date").textContent;
        text.textContent = post.querySelector("short").textContent;
    });
