// Contenitore dei colli
const colliContainer = document.getElementById("colliContainer");
const risultato = document.getElementById("risultato");

// Aggiungi collo
document.getElementById("addCollo").addEventListener("click", () => {
    const wrapper = document.createElement("div");
    wrapper.className = "collo-wrapper";

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.1";
    input.placeholder = "Peso collo (kg)";
    input.className = "collo";

    wrapper.appendChild(input);
    colliContainer.appendChild(wrapper);
});

// Calcola tariffa
document.getElementById("calcola").addEventListener("click", () => {
    const pesi = [...document.querySelectorAll(".collo")].map(i => parseFloat(i.value));

    if (pesi.length === 0) {
        risultato.innerHTML = "Aggiungi almeno un collo.";
        return;
    }

    if (pesi.some(isNaN)) {
        risultato.innerHTML = "Inserisci tutti i pesi correttamente.";
        return;
    }

    // Placeholder: qui inseriremo la logica tariffaria FedEx IPE
    const totale = pesi.reduce((a, b) => a + b, 0);

    risultato.innerHTML = `
        <strong>Calcolo effettuato</strong><br>
        Numero colli: ${pesi.length}<br>
        Peso totale: ${totale.toFixed(1)} kg<br>
        (La logica tariffaria verrà inserita qui)
    `;
});
