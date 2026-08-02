class SynonymProvider {
    #dictionary = null;
    #currentWord = null;

    async init() {
        try {
            const fileUrl = chrome.runtime.getURL("synonymsv2.json");
            const response = await fetch(fileUrl);
            this.#dictionary = await response.json();
        } catch (error) {
            console.error("Error fetching local resource:", error);
        }
    }

    get(word) {
        this.setCurrentWord(word);
        return this.#dictionary[word];
    }

    getCurrentWord() { return this.#currentWord; }

    setCurrentWord(newWord) {
        if (newWord) this.#currentWord = newWord;
    }
}

function createTooltip() {
    const tooltip = document.createElement("div");
    tooltip.id = "syn-tooltip";
    document.body.appendChild(tooltip);

    return tooltip;
}

function showToolTip(tooltip, word, synonyms) {
    console.log("im being called");
    const newHtml = [];
    for (const [w, s] of Object.entries(synonyms)) {
        newHtml.push(
            `<strong>${w}</strong>
                <br>
                ${(s?.join(", ") ?? "")}
            `
        )
    }

    tooltip.innerHTML = newHtml.join("<br><br>");
    tooltip.style.visibility = "visible";
}

function hideToolTip(tooltip) {
    tooltip.style.visibility = "hidden";
}

function parseMouseSelection(input) {
    const text = input.toString().trim();
    if (text.length < 1) return null;
    const lastSelectedWord = text
        .split(/\s+/)
        .pop()
        ?.replace(/[.,;:!?()"']/g, "");

    return lastSelectedWord;
}

function handleSelection(synonymProvider, tooltip, mouseEvent) {
    if (mouseEvent.detail > 1) return;

    hideToolTip(tooltip);
    const iframe = document.querySelector(".docs-texteventtarget-iframe");
    const selection = iframe?.contentWindow.getSelection() ?? window.getSelection();
    const word = parseMouseSelection(selection);

    if (word) {
        const stem = stemmer(word);
        const currentWord = synonymProvider.getCurrentWord();
        if (currentWord && currentWord === stem) {
            tooltip.style.visibility = "visible";
        } else {
            const wordMatches = synonymProvider.get(stem);
            tooltip.style.left = `${mouseEvent.clientX + window.scrollX + 10}px`;
            tooltip.style.top = `${mouseEvent.clientY + window.scrollY + 10}px`;

            console.log(wordMatches);
            if (wordMatches && showToolTip(tooltip, word, wordMatches));
        }
    }
}

async function main() {
    const synonymProvider = new SynonymProvider();
    await synonymProvider.init();
    const tooltip = createTooltip();

    document.addEventListener("mouseup", (e) => {
        setTimeout(() => {
            handleSelection(synonymProvider, tooltip, e)
        }, 0);
    });
}

main();
