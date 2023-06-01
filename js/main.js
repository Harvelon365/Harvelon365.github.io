// Typewriter logic
const text = document.querySelector(".sec-text");
const textload = () => {
    setTimeout(() => {
        text.textContent = "Harvey Tucker."
    }, 0);
    setTimeout(() => {
        text.textContent = "a student."
    }, 4000);
    setTimeout(() => {
        text.textContent = "a programmer."
    }, 8000);
    setTimeout(() => {
        text.textContent = "a trekkie"
    }, 12000);
}
textload();
setInterval(textload, 16000);