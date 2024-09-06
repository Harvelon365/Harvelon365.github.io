import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://fkvvqtxzinonofvsfrad.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdnZxdHh6aW5vbm9mdnNmcmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NTE3OTMsImV4cCI6MjAzNjAyNzc5M30.XLhySc5Ye7TBQd0IFELgv0mVLFy6m4gpf3_fWwHe10o');

const params = new URLSearchParams(window.location.search);

const { data, error } = await supabase.from('Posts').select();

var main = null;
var explore = null;

for (const post of data) {
    if (post.id == params.get('postID')) main = post;
    if (post.id == params.get('postID')-1) explore = post;
}
console.log(explore);

const title = document.getElementById("post-title");
const date = document.getElementById("post-date");
const text = document.getElementById("post-text");

title.textContent = main.title;

var da = new Date(main.created_at.substring(0, 10));

date.textContent = da.toLocaleString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' });
text.innerHTML = main.text.replace(/\n/g, "<br><br>");


const Ltitle = document.getElementById("latest-title");
const Ldate = document.getElementById("latest-date");
const Ltext = document.getElementById("latest-text");
const Lmore = document.getElementById("latest-more");


if (explore != null) {
    Lmore.href += "?postID=" + explore.id;
    Ltitle.textContent = explore.title;
    
    var da = new Date(explore.created_at.substring(0, 10));
    
    Ldate.textContent = da.toLocaleString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' });
    Ltext.textContent = explore.summary;
}
else {
    document.getElementById("explore-panel").style.display = "none";
}

document.getElementById("loading-cover").style.display = "none";