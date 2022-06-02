// Random Quote API URL
const quoteApiUrl = "https://api.quotable.io/random?minLength=80&maxLength=100";
const quoteSection = document.getElementById("quote");
const userInput = document.getElementById("quote-input");

let quote = "";
let time = 60;
let timer = "";
let mistakes = 0;

// Display Random Quote

const renderNewQuote = async () => {
    // fetch contents from url
    const response = await fetch(quoteApiUrl);

    // store response
    let data = await response.json();

    // acces quote
    quote = data.content;

    // array of characters in the quote
    let array = quote.split("").map(value => {
        // wrap teh characters in a span tag
        return "<span class='quote-chars'>" + value + "</span>"
    });

    // join array for displaying
    quoteSection.innerHTML += array.join("");
}

// logic for comparing input words with quote
userInput.addEventListener("input", () => {
    let quoteChars = document.querySelectorAll(".quote-chars");
    console.log(quoteChars);
    // create an array form received span tags
    quoteChars = Array.from(quoteChars);

    // array of user input characters
    let userInputChars = userInput.value.split("");

    // loop through each character in quote
    quoteChars.forEach((char, index) => {
        // check if char(quote character) = userInputChars[index](input characters)
        if (char.innerText == userInputChars[index]) {
            char.classList.add("sukses");
        }
        // if user hasn't entered anything or backspaced
        else if (userInputChars[index] == null) {
            if (char.classList.contains("sukses")) {
                char.classList.remove("sukses");
            } else {
                char.classList.remove("gagal");
            }
        }

        // if user enter wrong character
        else {
            //check if we already have added fail class
            if (!char.classList.contains("gagal")) {
                // increment and display mistakes
                mistakes += 1;
                char.classList.add("gagal");
            }
            document.getElementById("mistakes").innerText = mistakes;
        }

        // return true if all the characters are entered correctly
        let check = quoteChars.every(Element => {
            return Element.classList.contains("sukses")
        });
        // end test if all characters are correct
        if (check) {
            displayResult();
        }
    })
});

// Start Test ketika di klik start
const startTest = () => {
    mistakes = 0;
    timer = "";
    userInput.disabled = false;
    timeReduce();
    document.getElementById("start-test").style.display = "none";
    document.getElementById("stop-test").style.display = "block";
}

// update timer on screen
function updateTimer() {
    if (time == 0) {
        // end test if timer reaches 0
        displayResult();
    } else {
        document.getElementById("timer").innerText = --time + "s";
    }
}


// set timer
const timeReduce = () => {
    time = 60;
    timer = setInterval(updateTimer, 1000);
}

// End Test
const displayResult = () => {
    // display result div
    document.querySelector(".result").style.display = "block";
    clearInterval(timer);
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    let timeTaken = 1;
    if (time != 0) {
        timeTaken = (60 - time) / 100;
    }
    document.getElementById("wpm").innerText = (userInput.value.length / 5 / timeTaken).toFixed(2) + "  wpm";
    document.getElementById("akurasi").innerText = Math.round(((userInput.value.length - mistakes) / userInput.value.length) * 100) + "%";
}



window.onload = () => {
    userInput.value = "";
    document.getElementById("start-test").style.display = "block";
    document.getElementById("stop-test").style.display = "none";
    userInput.disabled = true;
    renderNewQuote();
}

