function updateHistory() {
    //Display message if the log is empty
    if (history.length == 0) {
        document.getElementById("historytable").innerHTML = "<thead><tr>Ingen transaksjoner</tr></thead>"
        return;
    }

    //Make a table containing rows of transactions
    let outElement = "<thead><tr><th>Fra</th><th>Til</th><th>Når</th><th>Kroner</th></tr></thead>"
    for (let i = 0; i < history.length; i++) {
        const transaction = history[i];
        outElement += `<tr>
                <td>${transaction.from}</td>
                <td>${transaction.to}</td>
                <td>${transaction.timestamp}</td>
                <td class="${(transaction.to == accountnum) ? "trans_in" : "trans_out"}">${(transaction.total/100).toFixed(2)}</td>
            </tr>`;
    }
    document.getElementById("historytable").innerHTML = outElement;
}