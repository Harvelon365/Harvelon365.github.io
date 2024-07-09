import { words4, words5 } from './weaver-words.js';

class WordInfo
{
    constructor()
    {
        this.relatedWords = [];
        this.heuristic = 0;
    }
}

class QueueWord
{
    constructor(word, wordInfo, distance, path)
    {
        this.word = word;
        this.info = wordInfo;
        this.distance = distance;
        this.path = path;
    }
}

class WordDict
{
    constructor(wordLength)
    {
        this.wordLength = wordLength;
        this.alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.dict = new Object();
    }
    
    AddWord(word)
    {
        this.dict[word] = new WordInfo();
    }
    
    WordExists(word)
    {
        return (word in this.dict);
    }

    GetWord(word)
    {
        return this.dict[word];
    }
    
    Init(endWord)
    {
        for (let word in this.dict)
        {
            let score = this.wordLength;
            for (let i = 0; i < this.wordLength; i++)
            {
                for (let letter of this.alphabet)
                {
                    let tempWord = word.split('');
                    tempWord[i] = letter;
                    tempWord = tempWord.join('');
                    if (this.WordExists(tempWord) && tempWord != word)
                    {
                        this.dict[word].relatedWords.push(tempWord);
                    }
                }
                
                if (word[i] == endWord[i]) score--;
            }
            this.dict[word].heuristic = score;
        }
        
        for (let word in this.dict)
        {
            this.dict[word].relatedWords.sort((a,b) => this.dict[a].heuristic - this.dict[b].heuristic);
        }
    }
}

function AddWordToDisplay(word, start, end)
{
    const container = document.getElementById("words-container");

    let wordPlace = document.createElement('div');
    wordPlace.className = "word";
    if (start == 1) wordPlace.id = "start";
    if (end == 1) wordPlace.id = "end";
    
    for (let i = 0; i < word.length; i++) {
        let letter = document.createElement('div');
        letter.className = "letter";
        letter.innerText = word[i].toUpperCase();
        wordPlace.appendChild(letter);
    }

    container.appendChild(wordPlace);
}

function WeaverSearch(start, end, dict)
{
    let finalPath = [];
    let queue = [];
    queue.push(new QueueWord(start, dict.GetWord(start), 0, []));
    
    while (queue.length > 0)
    {
        let q = queue.shift();
        
        if (q.word == end)
        {
            finalPath = q.path;
            break;
        }
        
        for (let word of q.info.relatedWords)
        {
            if (q.path.includes(word)) continue;
            
            let newPath = [...q.path, q.word];
            let newCost = q.distance + 1;
            let qw = new QueueWord(word, dict.GetWord(word), newCost, newPath);
            
            let existingWord = queue.find(w => w.word === word);
            if (existingWord != null)
            {
                if (newCost < existingWord.distance)
                {
                    queue.splice(queue.indexOf(existingWord), 1);
                    queue.push(qw);
                }
            }
            else
            {
                queue.push(qw);
            }
        }
        queue.sort((a,b) => (a.info.heuristic + a.distance) - (b.info.heuristic + b.distance));
    }

    finalPath.shift();
    AddWordToDisplay(start, 1, 0)
    
    for (const word of finalPath) {
        AddWordToDisplay(word, 0, 0);
    }

    AddWordToDisplay(end, 0, 1)

    document.getElementById("words-container").style.display = "grid";
    document.getElementById("words-container").scrollIntoView({ behavior: "smooth" });
}

function WeaverSolver()
{
    let startWord = "";
    let endWord = "";
    let dict;

    const startIn = document.getElementById("start-word");
    const endIn = document.getElementById("end-word");

    const noOfLetters = startIn.value.length;
    if (noOfLetters == 5)
    {
        dict = new WordDict(5);
        for (let word of words5)
        {
            dict.AddWord(word);
        }
    }
    else
    {
        dict = new WordDict(4);
        for (let word of words4)
        {
            dict.AddWord(word);
        }
    }
    
    startWord = startIn.value;

    endWord = endIn.value;
    
    dict.Init(endWord);
    
    WeaverSearch(startWord, endWord, dict);
}

const startButton = document.getElementById("start-button");
if (startButton != null)
{
    startButton.addEventListener("click", () => {
        document.getElementById("words-container").style.display = "grid";
        document.getElementById("words-container").innerHTML = ""
        WeaverSolver();
    });
}