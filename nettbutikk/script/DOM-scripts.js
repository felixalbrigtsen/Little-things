//Vis, skjul og tøm handlekurv
document.getElementById("navButton_kurv").onclick = function() {
    document.getElementById("handlekurv").style.display = "flex";
}
document.getElementById("button_lukkKurv").onclick = function() {
    document.getElementById("handlekurv").style.display = "none";
}
document.getElementById("button_tomKurv").onclick = function() {
    kurvVarer = [];
    oppdaterKurv();
}

//Oppdater filter for visning av varer
document.getElementById("navSelect_sortering").onclick = oppdaterVisning;
document.getElementById("navCheck_bukser").onclick = oppdaterVisning;
document.getElementById("navCheck_skjorter").onclick = oppdaterVisning;

//Søkefelt
document.getElementById("navTekst_sok").onkeyup = filtrerSok;