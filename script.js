// ===============================
//  CARICAMENTO TARIFFE FEDEX IPE
// ===============================

// Il file deve essere nella root del sito: /tariffe.json
let tariffe = null;

fetch("tariffe.json")
    .then(r => r.json())
    .then(data => {
        tariffe = data;
        console.log("Tariffe FedEx IPE caricate.");
    })
    .catch(err => {
        console.error("Errore nel caricamento tariffe:", err);
    });


// ===============================
//  GESTIONE UI
// ===============================

const colliContainer = document.getElementById("colliContainer");
const risultato = document.getElementById("risultato");

// Aggiungi un nuovo collo
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


// ===============================
//  FUNZIONI DI CALCOLO
// ===============================

// Trova la tariffa per un singolo collo
function trovaTariffa(zona, peso) {
    if (!tariffe || !tariffe[zona]) return null;

    const lista = tariffe[zona];

    // Trova la fascia peso corretta
    for (const fascia of lista) {
        if (peso >= fascia.min && peso <= fascia.max) {
            return fascia.valore;
        }
    }

    return null;
}

// Calcola il totale multi-collo
function calcolaTotale(zona, pesi) {
    let totale = 0;

    for (const peso of pesi) {
        const tariffa = trovaTariffa(zona, peso);
        if (tariffa === null) return null;
        totale += tariffa;
    }

    return totale;
}


// ===============================
//  CLICK SU "CALCOLA"
// ===============================

document.getElementById("calcola").addEventListener("click", () => {
    if (!tariffe) {
        risultato.innerHTML = "Tariffe non ancora caricate.";
        return;
    }

    const pesi = [...document.querySelectorAll(".collo")].map(i => parseFloat(i.value));

    if (pesi.length === 0) {
        risultato.innerHTML = "Aggiungi almeno un collo.";
        return;
    }

    if (pesi.some(isNaN)) {
        risultato.innerHTML = "Inserisci tutti i pesi correttamente.";
        return;
    }

    // Imposta la zona (per ora fissa, poi la rendiamo selezionabile)
    const zona = "A"; // ← puoi cambiarla o collegarla a un menu

    const totale = calcolaTotale(zona, pesi);

    if (totale === null) {
        risultato.innerHTML = "Peso fuori dalle fasce disponibili.";
        return;
    }

    const pesoTotale = pesi.reduce((a, b) => a + b, 0);

    risultato.innerHTML = `
        <strong>Risultato</strong><br>
        Zona: ${zona}<br>
        Numero colli: ${pesi.length}<br>
        Peso totale: ${pesoTotale.toFixed(1)} kg<br>
        Totale: € ${totale.toFixed(2)}
    `;
});
