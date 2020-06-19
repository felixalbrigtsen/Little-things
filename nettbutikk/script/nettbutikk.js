const visVedInnlasting = true;
var db = firebase.database();
var db_bukser = db.ref("varer/bukser");
var db_skjorter = db.ref("varer/skjorter");

var kurvVarer = [];

db_bukser.on("child_added", lastBukse);
db_skjorter.on("child_added", lastSkjorte);

const sorteringer = ["key", "navn", "farge", "pris", "tilfeldig"];

// //SETUP! Husk å åpne skrivetilgang i databasereglene.
// function nyBukse(key, navn, farge) {
//     var pris = (Math.floor(Math.random()*26)*50)+300;
//     key = "bukse0" + key;
//     var bukse = {
//         "navn": navn,
//         "pris": pris,
//         "farge": farge,
//         "bilde": key+".jpg"
//     };

//     db_bukser.child(key).set(bukse);
// }

// //var skjorteCount = 1;
// function nySkjorte(keynum, navn, farge) {
//     var pris = (Math.floor(Math.random()*20)*50)+200;
//     //key = "skjorte" + ("000"+skjorteCount).slice(-3);
//     key = "skjorte" + ("000"+keynum).slice(-3);
//     console.log(key);
//     skjorteCount++;
//     var skjorte = {
//         "navn": navn,
//         "pris": pris,
//         "farge": farge,
//         "bilde": key+".jpg"
//     };
//     db_skjorter.child(key).set(skjorte);
// }

var bukser = [];
var skjorter = [];

function lastBukse(snapshot) {
    var data = snapshot.val();
    var bukse = {};
    bukse.type = "bukse";
    bukse.key = snapshot.key;
    bukse.navn = data.navn;
    bukse.farge = data.farge;
    bukse.pris = data.pris;
    bukse.bilde = "bilder/" + data.bilde;
    bukser.push(bukse);

    if (visVedInnlasting) {
        visVare(bukse);
    }
}

function lastSkjorte(snapshot) {
    var data = snapshot.val();
    var skjorte = {};
    skjorte.type = "skjorte";
    skjorte.key = snapshot.key;
    skjorte.navn = data.navn;
    skjorte.farge = data.farge;
    skjorte.pris = data.pris;
    skjorte.bilde = "bilder/" + data.bilde;
    skjorter.push(skjorte);

    if (visVedInnlasting) {
        visVare(skjorte);
    }
}

function visVare(vare) {
    //Ikke legg til en vare som allerede synes. Vis "skjulte" varer.
    if (document.getElementById(vare.key) != undefined) { 
        document.getElementById(vare.key).style.display = "block"; //Show element if hidden
        return;
    }

    var vareArticle = document.createElement("article");
    vareArticle.classList.add("vare");
    vareArticle.classList.add(vare.type);
    vareArticle.setAttribute("id", vare.key);
    vareArticle.setAttribute("data-navn", vare.navn);
    vareArticle.setAttribute("data-farge", vare.farge);
    vareArticle.setAttribute("data-pris", vare.pris);
    vareArticle.setAttribute("data-type", vare.type);

    vareArticle.innerHTML = `
    <img src="${vare.bilde}">
    <div class="varetekst">
    <h2>${vare.navn}</h2>
    <h3>${vare.pris},-</h3>
    <button data-key="${vare.key}" onclick="leggIHandlevogn(this)">Legg i handlevogn</button>
    </div>`

    document.getElementById("catalog").appendChild(vareArticle);
}
function skjulVare(vare) {
    //Skjul elementet dersom det finnes
    if (document.getElementById(vare.key) != undefined) { 
        document.getElementById(vare.key).style.display = "none";
    }
}

function sammenlign(egenskap) {
    //Returnerer en sammenligningsfunksjon med to inputs, a og b, for bruk med array.sort
    if (egenskap == "pris") {
        return function(a, b) {
            verdiA = parseInt(a.pris);
            verdiB = parseInt(b.pris);
            if (verdiA > verdiB) { return 1; }
            if (verdiA < verdiB) { return -1; }
            return 0;
        }
    } else if (egenskap == "tilfeldig") {
        return function(a, b) {
            //Returnerer -1, 0 eller 1 med samme sannsynlighet
            return Math.floor(Math.random()*3)-1
        }
    } else {
        //Sammenligner tekst, sorterer f.eks. navn i alfabetisk rekkefølge
        return function(a, b) {
            var verdiA = a[egenskap].toUpperCase();
            var verdiB = b[egenskap].toUpperCase();
            if (verdiA > verdiB) { return 1; }
            if (verdiA < verdiB) { return -1; }
            return 0
        }
    }
}

function oppdaterVisning() {
    var visBukser = document.getElementById("navCheck_bukser").checked;
    var visSkjorter = document.getElementById("navCheck_skjorter").checked;

    var synlige = [];
    if (visBukser && visSkjorter) { synlige = bukser.concat(skjorter); }
    else if (visBukser) { synlige = bukser; }
    else if (visSkjorter) { synlige = skjorter; }

    var sorteringskriterie = sorteringer[parseInt(document.getElementById("navSelect_sortering").value)];
    synlige.sort(sammenlign(sorteringskriterie));

    document.getElementById("catalog").innerHTML = "";
    for (var i = 0; i < synlige.length; i++) {
        visVare(synlige[i]);
    }
    filtrerSok();
}

function filtrerSok() {
    var query = document.getElementById("navTekst_sok").value.toUpperCase();
    var vareArtikler = document.getElementById("catalog").children;

    for (var i=0; i < vareArtikler.length; i++) {
        var vareNavn = vareArtikler[i].getAttribute("data-navn").toUpperCase();
        var vareKey = vareArtikler[i].getAttribute("id");

        if ( vareArtikler[i].getAttribute("data-type") == "bukse") {
            vare = bukser[bukser.map(x=>x.key).indexOf(vareKey)];
        } else {
            vare = skjorter[skjorter.map(x=>x.key).indexOf(vareKey)];
        }
        
        if (vareNavn.includes(query) || query == "") {
            visVare(vare);
        } else {
            skjulVare(vare);
        }
    }
}

function leggIHandlevogn(button) {
    var key = button.getAttribute("data-key");
    var vare;
    if (key.includes("bukse")) {
        var vareindeks = bukser.map(x => x.key).indexOf(key);
        vare = bukser[vareindeks];
    } else {
        var vareindeks = skjorter.map(x => x.key).indexOf(key);
        vare = skjorter[vareindeks];
    }

    kurvVarer.push(vare);
    oppdaterKurv();
}

function oppdaterKurv() {
    var totalsum = 0;

    //Tøm liste
    var listeElement = document.getElementById("kurvTabell");
    while (listeElement.children.length > 1) {
        listeElement.removeChild(listeElement.children[1]);
    }

    //Legg til hvert element i listen
    for (var i = 0; i < kurvVarer.length; i++) {
        var vare = kurvVarer[i];
        totalsum += vare.pris;

        var rad = document.createElement("tr");
        rad.setAttribute("data-key", vare.key);
        rad.innerHTML = `
        <td><img class="kurvBilde" src="${vare.bilde}"></td>
        <td>${vare.navn}</td>
        <td>${vare.pris}kr</td>
        <td><button data-key="${vare.key}" onclick="fjernFraKurv(this)">Fjern</button></td>`
        listeElement.appendChild(rad);
    }

    document.getElementById("kurvSum").innerHTML = "Totalsum: " + totalsum + ",-";
    if (totalsum == 0) { document.getElementById("kurvSum").innerHTML = "Totalsum: 0,-"; }
}

function fjernFraKurv(button) {
    var rader = document.getElementById("kurvTabell").children;
    var knapper = [];

    for (var i = 1; i < rader.length; i++) {
        var rad = rader[i];
        var knapp = rad.lastChild.lastChild;
        knapper.push(knapp);
    }

    var listeIndeks = knapper.indexOf(button);
    kurvVarer.splice(listeIndeks,1);
    oppdaterKurv();
}