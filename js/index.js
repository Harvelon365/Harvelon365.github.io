import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://fkvvqtxzinonofvsfrad.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZrdnZxdHh6aW5vbm9mdnNmcmFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjA0NTE3OTMsImV4cCI6MjAzNjAyNzc5M30.XLhySc5Ye7TBQd0IFELgv0mVLFy6m4gpf3_fWwHe10o');

const { data, error } = await supabase.from('Posts').select();

console.log(data);

const title = document.getElementById("latest-title");
const date = document.getElementById("latest-date");
const text = document.getElementById("latest-text");
const more = document.getElementById("latest-more");

title.textContent = data[data.length-1].title;

var da = new Date(data[data.length-1].created_at.substring(0, 10));

date.textContent = da.toLocaleString('en-UK', { day: 'numeric', month: 'long', year: 'numeric' });
text.textContent = data[data.length-1].summary;