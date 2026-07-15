class SynonymProvider {
    #dictionary = null;

    async init() {
        try {
            const fileUrl = chrome.runtime.getURL("synonyms.json");
            const response = await fetch(fileUrl);
            this.#dictionary = await response.json();
        } catch (error) {
            console.error("Error fetching local resource:", error);
        }
    }

    get(word) {
        return this.#dictionary[word];
    }
}


function parseMouseSelection(input) {
    const text = input.toString().trim();
    if (text.length === 0) return null;
    const lastSelectedWord = text
        .split(/\s+/)
        .pop()
        ?.replace(/[.,;:!?()"']/g, "");

    return lastSelectedWord;
}

function handleSelection(synonymProvider) {
    const word = parseMouseSelection(window.getSelection());
    if (word) console.log(word + ": " + (synonymProvider.get(word) ?? ""));
}

async function main() {
    const synonymProvider = new SynonymProvider();
    await synonymProvider.init();
    document.addEventListener("mouseup", () => handleSelection(synonymProvider));
}

main();