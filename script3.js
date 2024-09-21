const questionInput = document.getElementById('question');
const askBtn = document.getElementById('ask-btn');
const responseElement = document.getElementById('response');
const keys = document.getElementById('test');

askBtn.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    
    if (question === '') {
        responseElement.innerHTML = "<p style='color: red;'>Veuillez écrire quelque chose!</p>";
        return;
    }

    try {
        // Afficher un message de chargement pendant la recherche
        responseElement.innerHTML = "<p>Recherche en cours⏳...</p>";
        keys.innerHTML = '';

        // Effectuer la requête à l'API
        const response = await fetch(`https://deku-rest-api.gleeze.com/search/chords?q=${question}`);
        const data = await response.json();

        if (data && data.chord) {
            const accord = data.chord.chords;
            const clef = data.chord.key;

            // Afficher les résultats
            responseElement.innerText = `Accords trouvés: ${accord}`;
            keys.innerText = `Clef: ${clef}`;
        } else {
            // Afficher un message si aucune donnée n'est renvoyée
            responseElement.innerHTML = "<p style='color: orange;'>Aucun accord trouvé pour cette recherche.</p>";
        }
    } catch (error) {
        console.error(error);
        // Afficher un message d'erreur si la requête échoue
        responseElement.innerHTML = "<p style='color: red;'>Erreur lors de la recherche. Veuillez réessayer plus tard.</p>";
    }
});
