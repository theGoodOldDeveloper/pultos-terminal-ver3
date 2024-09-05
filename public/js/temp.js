kimertKiszerelesHTML = ""; //NOTE:NOTE:
console.log("eddig OK Kiszereles");
$("#myModalKiszereles").modal();
for (let index = 0; index < state.xkimeresnev.length; index++) {
    //if (state.xkimeresnev[index].kiszereles_id == 2)
    kimertKiszerelesHTML += `<div class = "card m-3 kiszereles" id=${state.xkimeresnev[index].id}><h5>${state.xkimeresnev[index].nev}</h5></div>`;
}
document.getElementById("kimertTermekek").innerHTML = kimertKiszerelesHTML;
$(".kiszereles").click(function () {
    console.log(this.id);
    $(".modal .close").click(); //NOTE:NOTE:
});
