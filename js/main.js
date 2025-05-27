const heroTitle = document.getElementById("hero-title");
const heroTitleContainer = document.getElementById("hero-title-container");
const changeInterval = 2000;
const titles = [
    'PRINT "Hello world!"',
    'printf("Hello world!\\n");',
    'std::cout << "Hello world!\\n";',
    'Console.WriteLine("Hello world!");',
    'fmt.Println("Hello world!")',
    '<p>Hello world!</p>',
    'println!("Hello world!");',
    'System.out.println("Hello world!");',
    'WriteLn("Hello world!")',
    'print("Hello world!")'
]

let currentIndex = 0;
let currentFontSize = 10;

function ResizeToFit() {
    heroTitle.style.fontSize = currentFontSize + 'rem';

    // Check if the text overflows
    while (heroTitle.clientWidth > heroTitleContainer.clientWidth && currentFontSize > 0.5) {
        currentFontSize -= 0.1; // Reduce font size by a larger step
        heroTitle.style.fontSize = currentFontSize + 'rem';
    }

    // Optional: Add a minimum font size to prevent it from becoming too small
    if (currentFontSize <= 0.5) {
        heroTitle.style.fontSize = '0.5rem'; // Or some other minimum
    }
}

function UpdateText() {
    heroTitle.textContent = titles[currentIndex];
    currentIndex = (currentIndex + 1) % titles.length;
    currentFontSize = 10;
    ResizeToFit();
}

UpdateText();

setInterval(UpdateText, changeInterval);