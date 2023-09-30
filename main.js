let element_words;
let element_guess_input;
$(document).ready(() => {
    element_words = $("#words")[0];
    element_guess_input = $("#guess_input")[0];
    element_guess_input.oninput = () => {
        const letter = element_guess_input.value.toString().toLowerCase();
        element_guess_input.value = null;
        if (!guessed_letters.includes(letter)) {guessed_letters.push(letter);}
        GenerateWords();
        GenerateDrawing();
    };
    $("#game, #game-over, #game-won").hide();
});

let words;
let guessed_letters = [];

function Start() {
    words = $("#words-to-guess").val().split(" ");
    if (words[0].replaceAll(" ", "").length > 0) {
        $("#start").hide();
        $("#game").show();
        GenerateWords();
        GenerateDrawing();
    }
}

function RandomWords() {
    const count = Math.floor(Math.random() * 4) + 1;
    const w2g = $("#words-to-guess")[0];
    fetch("https://random-word-api.herokuapp.com/word?number=" + count)
        .then(r => r.json())
        .then(json => w2g.value = json.toString().replaceAll(",", " "))
        .then(Start);
}

function GetWordsString() {return words.reduce((sum, current) => {return sum += current;}).toLowerCase();}

function GenerateDrawing() {
    const words_string = GetWordsString();
    const drawing_elements = $("#drawing > *");
    drawing_elements.addClass("hidden");
    let i = 0;
    let incorrect_guessed_letters = new Set;
    guessed_letters.forEach(letter => {
        if (!words_string.includes(letter)) {
            incorrect_guessed_letters.add(letter);
            drawing_elements.eq(i++).removeClass("hidden");
        }
    });
    const incorrect = $("#incorrect")[0];
    incorrect.textContent = "Incorrect: ";
    incorrect_guessed_letters.forEach(letter => {incorrect.textContent += letter;});
    if (i === 13) {
        $("#guess").hide();
        $("#game-over").show();
        let i = 0;
        for (let letter of GetWordsString()) {
            if (!guessed_letters.includes(letter)) {
                const span = $("#words span")[i];
                span.textContent = letter;
                span.className = "not-guessed";
            }
            i ++;
        }
        for (let i = 7; i < 13; i++) {drawing_elements[i].style.stroke = "red";}
        drawing_elements.removeClass("hidden");
    }
}

function GenerateWords() {
    let children = [];
    let guessed_correct = 0;
    words.forEach(word => {
        const container = document.createElement("div");
        children.push(container);
        for (let letter of word) {
            const span = document.createElement("span");
            container.appendChild(span);
            if (guessed_letters.includes(letter.toLowerCase())) {
                span.textContent = letter;
                guessed_correct ++;
            }
        }
    });
    element_words.replaceChildren(...children);
    const chars = GetWordsString().length;
    if (guessed_correct === chars) {
        $("#guess").hide();
        $("#game-won").show();
    }
}