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

function createTooltip() {
    const tooltip = document.createElement("div");
    tooltip.id = "syn-tooltip";
    document.body.appendChild(tooltip);

    return tooltip;
}

function showToolTip(tooltip, word, synonyms) {
    tooltip.innerHTML = `
        <strong>${word}</strong>
        <br>
        <br>
        ${(synonyms?.join("<br>") ?? "")}
    `;
    tooltip.style.display = "inline";
}

function hideToolTip(tooltip) {
    tooltip.innerHTML = "";
    tooltip.style.display = "none";
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
    const selection = window.getSelection();
    const word = parseMouseSelection(selection);
    const tooltip = createTooltip();

    if (word) {
        const rect = selection.getRangeAt(0).getBoundingClientRect();
        tooltip.style.left = `${rect.left + window.scrollX}px`;
        tooltip.style.top = `${rect.bottom + window.scrollY + 10}px`;

        showToolTip(tooltip, word, synonymProvider.get(word));
    }

    hideToolTip(tooltip);
    
}

async function main() {
    const synonymProvider = new SynonymProvider();
    await synonymProvider.init();
    document.addEventListener("mouseup", () => handleSelection(synonymProvider));
}

main();