// script.js

// Exécuter le code après que le DOM soit entièrement chargé
document.addEventListener("DOMContentLoaded", function() {
    // Sélection des éléments HTML
    const form = document.getElementById('form');
    const searchInput = document.getElementById('search');
    const resultSection = document.getElementById('result');

    // API URL de recherche des paroles
    const apiURL = 'https://api.lyrics.ovh/v1/';

    // Fonction de recherche de paroles
    async function searchLyrics(artist, songTitle) {
        try {
            const response = await fetch(`${apiURL}${artist}/${songTitle}`);
            const data = await response.json();

            if (data.lyrics) {
                displayLyrics(data.lyrics, artist, songTitle);
            } else {
                resultSection.innerHTML = `<p>Aucune parole trouvée pour "${songTitle}" par "${artist}".</p>`;
            }
        } catch (error) {
            resultSection.innerHTML = `<p>Une erreur s'est produite. Veuillez réessayer plus tard.</p>`;
        }
    }

    // Fonction d'affichage des paroles dans la section résultat
    function displayLyrics(lyrics, artist, songTitle) {
        resultSection.style.display = 'block';
        resultSection.innerHTML = `
            <h2>Paroles de "${songTitle}" par ${artist}</h2>
            <pre>${lyrics}</pre>
        `;
    }

    // Gestionnaire d'événement pour la soumission du formulaire
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page lors de la soumission

        const searchValue = searchInput.value.trim();

        // Vérification que le champ de recherche n'est pas vide
        if (!searchValue) {
            resultSection.innerHTML = '<p>Veuillez entrer un nom d\'artiste ou un titre de chanson.</p>';
            resultSection.style.display = 'block';
            return;
        }

        // Séparation de l'artiste et du titre de la chanson à partir de l'entrée de l'utilisateur
        const [artist, songTitle] = searchValue.split(' - ').map(item => item.trim());

        // Si les deux (artiste et titre) sont bien définis
        if (artist && songTitle) {
            resultSection.innerHTML = '<p>Recherche en cours...</p>'; // Affichage d'un message de chargement
            searchLyrics(artist, songTitle);
        } else {
            resultSection.innerHTML = '<p>Format incorrect. Utilisez "Artiste - Titre de la chanson".</p>';
        }
    });
});
