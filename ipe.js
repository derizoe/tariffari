// ======================================================
//  FEDEX IP – MOTORE DI CALCOLO COMPLETO E PULITO
// ======================================================

// ---------------------------
//  CARICAMENTO TARIFFE IP
// ---------------------------

let tariffe = null;
let zoneMap = null;

async function caricaDati() {
    try {
        const t = await fetch("tariffe_ip.json");
        tariffe = await t.json();

        const z = await fetch("zone_ip.json");
        zoneMap = await z.json();

        popolaMenuPaesi();
        console.log("Dati FedEx IP caricati.");
    } catch (err) {
        console.error("Errore nel caricamento dati:", err);
    }
}

caricaDati();


// ---------------------------
//  POPOLAMENTO MENU PAESI
// ---------------------------

function popolaMenuPaesi() {
    const select = document.getElementById("paese");
    Object.keys(zoneMap).sort().forEach(paese => {
        const opt = document.createElement("option");
        opt.value = paese;
        opt.textContent = paese;
        select.appendChild(opt);
    });
}


// ---------------------------
//  FUNZIONI DI SUPPORTO
// ---------------------------

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

function calcolaTariffaIP(zona, pesi) {
    if (!tariffe) return { errore: "Tariffe non caricate." };
    if (!zona || !tariffe[zona]) return { errore: "Zona non valida." };
    if (!Array.isArray(pesi) || pesi.length === 0) return { errore: "Nessun collo inserito." };
    if (pesi.some(isNaN)) return { errore: "Pesi non validi." };

    const totale = calcolaMultiCollo(zona, pesi);
    if (totale === null) return { errore: "Peso fuori dalle fasce disponibili." };

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
    const paese = document.getElementById("paese").value;
    const box = document.getElementById("risultato");

    if (!paese) {
        box.innerHTML = "Seleziona un Paese.";
        return;
    }

    const zona = zoneMap[paese];

    const pesi = [...document.querySelectorAll(".collo")].map(i => parseFloat(i.value));

    const output = calcolaTariffaIP(zona, pesi);

    if (output.errore) {
        box.innerHTML = output.errore;
        return;
    }

    box.innerHTML = `
        <strong>Risultato</strong><br>
        Paese: ${paese}<br>
        Zona: ${zona}<br>
        Colli: ${output.numeroColli}<br>
        Peso totale: ${output.pesoTotale.toFixed(1)} kg<br>
        Totale: € ${output.totale.toFixed(2)}
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
