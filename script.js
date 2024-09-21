const welcomeText = "Bonjour cher visiteur et cher utilisateur sur le site de Mi-dev Madagascar,.";
const chooseText = "Veuillez choisir le menu que vous voulez utiliser :";
let index = 0;
const textElement = document.getElementById("welcome-text");
const chooseTextElement = document.getElementById("choose-text");
const menu = document.getElementById("menu");

function typeText(element, text, callback) {
    if (index < text.length) {
        element.innerHTML += text.charAt(index);
        index++;
        setTimeout(() => typeText(element, text, callback), 80);
    } else if (callback) {
        callback();
    }
}

function startAnimations() {
    document.querySelector('.animated-line').style.width = '50%'; // Ligne sous le message de bienvenue
    setTimeout(() => {
        document.querySelector('.choose-line').style.width = '50%'; // Ligne sous le texte "Choisir le menu"
        setTimeout(() => {
            menu.classList.add('show'); // Afficher les boutons du menu
        }, 500);
    }, 500);
}

window.onload = () => {
    typeText(textElement, welcomeText, () => {
        document.querySelector('.welcome-container').classList.add('move-up'); // Animation du texte de bienvenue
        index = 0; // Réinitialiser l'index pour le deuxième texte
        typeText(chooseTextElement, chooseText, () => {
            document.querySelector('.choose-menu-container').classList.add('visible'); // Affichage du texte de choix du menu
            startAnimations(); // Déclencher les animations
        });
    });
};
