function updateDash() {
    document.getElementById("accountinfo_name").innerHTML = "<b>Kontoinnehaver: </b>" + account.name;
    document.getElementById("accountinfo_dob").innerHTML = "<b>Fødselsdato: </b>" + account.dob;
    document.getElementById("accountinfo_balance").innerHTML = "<b>Saldo: "+ (account.balance / 100).toFixed(2) + "kr </b>";
}