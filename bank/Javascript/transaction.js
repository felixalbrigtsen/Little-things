
document.getElementById("in_transferToAccount").oninput = (e)=>{
    //Only allows numbers, except position 5, which must be a dash
    if (!(
        ((e.target.value.length != 5) &&  (["","0","1","2","3","4","5","6","7","8","9"].includes(e.target.value.substr(-1))))
        || ((e.target.value.length == 5) && (e.target.value[4]=="-"))
        )) {
            //If an invalid char was entered, discard the last char
            e.target.value = e.target.value.substr(0, e.target.value.length-1);
        }
    
    if (e.inputType=="insertText" && e.target.value.length == 4) {
        //Add the dash after the 4th char
        e.target.value += "-"
    }
}
document.getElementById("in_transferAmount").onchange = (e)=>{
    //Make sure we don't use any denomination less than 1 øre
    e.target.value = parseFloat(e.target.value).toFixed(2);
}
function transfer() {
    const transferAccNum = document.getElementById("in_transferToAccount").value;
    const transferAmount = parseInt(parseFloat(document.getElementById("in_transferAmount").value)*100);

    if (transferAccNum.length != 9) { showError("Hele kontonummeret er ikke skrevet inn."); return; }
    if (transferAmount < 1) { showError("Du kan ikke overføre 0 eller negative beløp. "); return;}

    if (transferAmount > account.balance) { showError("Du har ikke nok penger på konto. "); return;}

    const commit_transfer = confirm("Er du sikker på at du vil overføre " + (transferAmount/100).toFixed(2) + "NOK?");
    if (!commit_transfer) { return; }

    let receiverAccount;
    db.ref("accounts/"+transferAccNum).once("value").then(data => {
        receiverAccount=data.val()
        if (receiverAccount == null) { showError("Kontoen finnes ikke."); return; }
    
            //Add transfer to history:
        const transferObj = {
            "from": accountnum,
            "to": transferAccNum,
            "total": transferAmount,
            "timestamp": dateObj.toLocaleString()
        };
        db.ref("transactions").push(transferObj);

        //Decrease user balance
        db.ref("accounts/"+accountnum).update({balance: account.balance-transferAmount});
        //Increase receiver balance
        db.ref("accounts/"+transferAccNum).update({balance: receiverAccount.balance+transferAmount});

        refreshData();

        document.getElementById("transfer_success").style.display = "block";
        setTimeout(()=>document.getElementById("transfer_success").style.display="none", 2000);


        let img = document.getElementById("transferimg");
        document.getElementById("transferimg").classList.remove("hidden");
        document.getElementById("transferimg").classList.add("animated");
        setTimeout(()=>{document.getElementById("transferimg").classList.remove("animated");document.getElementById("transferimg").classList.add("hidden")}, 2000);
    });
    
}