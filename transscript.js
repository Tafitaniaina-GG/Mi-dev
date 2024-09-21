const fromText = document.querySelector(".from-text");
const toText = document.querySelector(".to-text");
const exchangeIcon = document.querySelector(".exchange");
const selectTag = document.querySelectorAll("select");
const icons = document.querySelectorAll(".input-box i");
const translateBtn = document.querySelector(".translate-btn");
const startTranslationBtn = document.getElementById('start-translation');
const translatorContainer = document.querySelector('.translator-container');
const welcomeMessage = document.querySelector('.welcome-message');
const voiceSelect = document.getElementById("voice-select");

// Liste des langues avec leurs drapeaux
const countries = [
    { code: "en-GB", name: "Anglais", flag: "🇬🇧", color: "#fff", bgColor: "#1f77b4" },
    { code: "fr-FR", name: "Français", flag: "🇫🇷", color: "#fff", bgColor: "#2c3e50" },
    { code: "es-ES", name: "Espagnol", flag: "🇪🇸", color: "#fff", bgColor: "#e74c3c" },
    { code: "de-DE", name: "Allemand", flag: "🇩🇪", color: "#fff", bgColor: "#f39c12" },
    { code: "mg-MG", name: "Malagasy", flag: "🇲🇬", color: "#fff", bgColor: "#27ae60" },
    { code: "zh-CN", name: "Chinois", flag: "🇨🇳", color: "#fff", bgColor: "#c0392b" },
    { code: "ja-JP", name: "Japonais", flag: "🇯🇵", color: "#fff", bgColor: "#8e44ad" },
    { code: "ru-RU", name: "Russe", flag: "🇷🇺", color: "#fff", bgColor: "#2980b9" },
    { code: "ko-KR", name: "Coréen", flag: "🇰🇷", color: "#fff", bgColor: "#16a085" },
    { code: "hi-IN", name: "Hindi", flag: "🇮🇳", color: "#fff", bgColor: "#d35400" },
    { code: "ar-SA", name: "Arabe", flag: "🇸🇦", color: "#fff", bgColor: "#2ecc71" },
    { code: "it-IT", name: "Italien", flag: "🇮🇹", color: "#fff", bgColor: "#e67e22" },
    { code: "pt-PT", name: "Portugais", flag: "🇵🇹", color: "#fff", bgColor: "#e74c3c" },
    { code: "vi-VN", name: "Vietnamien", flag: "🇻🇳", color: "#fff", bgColor: "#c0392b" },
    { code: "th-TH", name: "Thaïlandais", flag: "🇹🇭", color: "#fff", bgColor: "#2980b9" },
    // Ajoutez ici d'autres langues pour atteindre 50 ou plus
];

// Fonction pour initialiser les options avec drapeaux et couleurs
function populateLanguageSelects() {
    selectTag.forEach(select => {
        countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.code;
            option.innerHTML = `${country.flag} ${country.name}`;
            option.style.color = country.color;
            option.style.backgroundColor = country.bgColor;
            select.appendChild(option);
        });
    });
}

// Recherche de langue dans le sélecteur
selectTag.forEach(select => {
    const searchInput = document.createElement('input');
    searchInput.placeholder = 'Rechercher une langue...';
    searchInput.classList.add('search-language');
    select.parentNode.insertBefore(searchInput, select);

    searchInput.addEventListener('input', (e) => {
        const filter = e.target.value.toLowerCase();
        Array.from(select.options).forEach(option => {
            const text = option.text.toLowerCase();
            if (text.includes(filter)) {
                option.style.display = 'block';
            } else {
                option.style.display = 'none';
            }
        });
    });
});

// Appel à la fonction pour remplir les sélecteurs
populateLanguageSelects();

// Échange des langues
exchangeIcon.addEventListener("click", () => {
    let tempText = fromText.value,
        tempLang = selectTag[0].value;
    fromText.value = toText.value;
    toText.value = tempText;
    selectTag[0].value = selectTag[1].value;
    selectTag[1].value = tempLang;
});

// Effacer la traduction lorsque le texte de départ est vide
fromText.addEventListener("keyup", () => {
    if (!fromText.value) {
        toText.value = "";
    }
});

// Traduction avec l'API MyMemory
translateBtn.addEventListener("click", () => {
    let text = fromText.value.trim(),
        translateFrom = selectTag[0].value,
        translateTo = selectTag[1].value;
    if (!text) return;
    toText.setAttribute("placeholder", "Traduction en cours...");
    let apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${translateFrom}|${translateTo}`;
    fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
            if (data.responseData) {
                toText.value = data.responseData.translatedText;
            } else if (data.matches && data.matches.length > 0) {
                toText.value = data.matches[0].translation;
            } else {
                toText.value = "Traduction non disponible";
            }
            toText.setAttribute("placeholder", "Traduction");
        })
        .catch(error => {
            toText.value = "Erreur lors de la traduction";
        });
});

// Gestion des icônes (copier et lecture)
icons.forEach(icon => {
    icon.addEventListener("click", ({ target }) => {
        if (!fromText.value || !toText.value) return;
        if (target.classList.contains("fa-copy")) {
            if (target.id == "from") {
                navigator.clipboard.writeText(fromText.value);
            } else {
                navigator.clipboard.writeText(toText.value);
            }
        } else {
            let utterance;
            if (target.id == "from") {
                utterance = new SpeechSynthesisUtterance(fromText.value);
                utterance.lang = selectTag[0].value;
                utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === selectTag[0].value && voice.name.includes(voiceSelect.value));
            } else {
                utterance = new SpeechSynthesisUtterance(toText.value);
                utterance.lang = selectTag[1].value;
                utterance.voice = speechSynthesis.getVoices().find(voice => voice.lang === selectTag[1].value && voice.name.includes(voiceSelect.value));
            }
            speechSynthesis.speak(utterance);
        }
    });
});

// Afficher le traducteur après avoir cliqué sur "Commencer"
startTranslationBtn.addEventListener('click', () => {
    welcomeMessage.style.display = 'none';
    translatorContainer.style.display = 'block';
});

// Charger les voix disponibles dans la synthèse vocale
function loadVoices() {
    const voices = speechSynthesis.getVoices();
    voiceSelect.innerHTML = '<option value="male">Homme</option><option value="female">Femme</option>';
}

// Initialisation des voix
speechSynthesis.onvoiceschanged = loadVoices;
