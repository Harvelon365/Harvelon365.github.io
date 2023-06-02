// Typewriter logic
const text = document.querySelector(".sec-text");
const textload = () => {
    setTimeout(() => {
        text.textContent = "Harvey Tucker."
    }, 0);
    setTimeout(() => {
        if (window.innerWidth < 1050) {text.textContent = "Harvey Tucker"}
        else {text.textContent = "a student."}
    }, 4000);
    setTimeout(() => {
        if (window.innerWidth < 1050) {text.textContent = "Harvey Tucker"}
        else {text.textContent = "a programmer."}
    }, 8000);
    setTimeout(() => {
        if (window.innerWidth < 1050) {text.textContent = "Harvey Tucker"}
        else {text.textContent = "a developer."}
    }, 12000);
}

textload();
setInterval(textload, 16000);
