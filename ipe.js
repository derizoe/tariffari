// ======================================================
//  FEDEX IPE – MOTORE DI CALCOLO COMPLETO E PULITO
// ======================================================

// ---------------------------
//  CARICAMENTO TARIFFE
// ---------------------------

let tariffe = null;

async function caricaTariffe() {
    try {
        const r = await fetch("tariffe.json");
        tariffe = await r.json();
        console.log("Tariffe FedEx IPE caricate.");
    } catch (err) {
        console.error("Errore nel caricamento tariffe:", err);
    }
}

caricaTariffe();


// ---------------------------
//  FUNZIONI DI SUPPORTO
// ---------------------------

// Trova la tariffa per un singolo collo
function trovaTariffa(zona, peso) {
    if (!tariffe || !tariffe[zona]) return null;

    const fasce = tariffe[zona];

    for (const f of fasce) {
        if (peso >= f.min && peso <= f.max) {
            return f.valore;
        }
    }

    return null;
}

// Calcolo multi-collo
function calcolaMultiCollo(zona, pesi) {
    let totale = 0;

    for (const peso of pesi) {
        const t = trovaTariffa(zona, peso);
        if (t === null) return null;
        totale += t;
    }

    return totale;
}


// ---------------------------
//  LOGICA PRINCIPALE
// ---------------------------

function calcolaTariffaIPE(zona, pesi) {
    if (!tariffe) {
        return { errore: "Tariffe non caricate." };
    }

    if (!zona || !tariffe[zona]) {
        return { errore: "Zona non valida." };
    }

    if (!Array.isArray(pesi) || pesi.length === 0) {
        return { errore: "Nessun collo inserito." };
    }

    if (pesi.some(isNaN)) {
        return { errore: "Pesi non validi." };
    }

    const totale = calcolaMultiCollo(zona, pesi);
    if (totale === null) {
        return { errore: "Peso fuori dalle fasce disponibili." };
    }

    const pesoTotale = pesi.reduce((a, b) => a + b, 0);

    return {
        zona,
        numeroColli: pesi.length,
        pesoTotale,
        totale
    };
}


// ---------------------------
//  INTEGRAZIONE CON LA UI
// ---------------------------

document.getElementById("calcola").addEventListener("click", () => {
    const pesi = [...document.querySelectorAll(".collo")].map(i => parseFloat(i.value));

    // Per ora zona fissa (poi la rendiamo selezionabile)
    const zona = "A";

    const risultato = calcolaTariffaIPE(zona, pesi);
    const box = document.getElementById("risultato");

    if (risultato.errore) {
        box.innerHTML = risultato.errore;
        return;
    }

    box.innerHTML = `
        <strong>Risultato</strong><br>
        Zona: ${risultato.zona}<br>
        Colli: ${risultato.numeroColli}<br>
        Peso totale: ${risultato.pesoTotale.toFixed(1)} kg<br>
        Totale: € ${risultato.totale.toFixed(2)}
    `;
});


// ---------------------------
//  AGGIUNTA COLLI DINAMICA
// ---------------------------

document.getElementById("addCollo").addEventListener("click", () => {
    const div = document.createElement("div");
    div.className = "collo-wrapper";

    const input = document.createElement("input");
    input.type = "number";
    input.step = "0.1";
    input.placeholder = "Peso collo (kg)";
    input.className = "collo";

    div.appendChild(input);
    document.getElementById("colliContainer").appendChild(div);
});

