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
            finalPath.push(q.word);
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
    
    console.log("\n----------\n" + finalPath.join("\n") + "\n----------\n");
}

function WeaverSolver()
{
    let startWord = "";
    let endWord = "";
    let dict;
    
    const noOfLetters = prompt("4 or 5 letter game?");
    if (noOfLetters == "5")
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
    
    while (!dict.WordExists(startWord))
    {
        startWord = prompt("Starting word:").toLowerCase();
        console.log(dict.GetWord(startWord));
    }
    while (!dict.WordExists(endWord))
    {
        endWord = prompt("Ending word:").toLowerCase();
    }
    
    dict.Init(endWord);
    
    WeaverSearch(startWord, endWord, dict);
}

//WeaverSolver();