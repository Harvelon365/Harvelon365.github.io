import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://fkvvqtxzinonofvsfrad.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdnZxdHh6aW5vbm9mdnNmcmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NTE3OTMsImV4cCI6MjAzNjAyNzc5M30.XLhySc5Ye7TBQd0IFELgv0mVLFy6m4gpf3_fWwHe10o');

const { data, error } = await supabase.from('Posts').select();

const index = document.getElementById("blog-index");


for (const post of data) {
    var da = new Date(post.created_at.substring(0, 10));
    index.innerHTML += '<a href="post.html?postID=' + post.id + '" class="blog-index-row">'
    + '<p class="panel-accent">' + da.toLocaleString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' }) + '</p>'
    + '<p id="post-text">' + post.title + '</p>'
    + '</a>';
}

document.getElementById("loading-cover").style.display = "none";