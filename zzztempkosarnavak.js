getOnlyKosarNevek();
async function getOnlyKosarNevek() {
  const response = await fetch("/api/onlykosarnevek");
  const data = await response.json();
  state.kosarNevekOnly = data;
  console.log("state.kosarNevekOnly> 😁😁😁 :", state.kosarNevekOnly);

  console.log("jaarok itt egzaaltalaan-----------");
  await document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("nameInput");
    const okButton = document.getElementById("okButton");
    let nameModal;
    nameModal = new bootstrap.Modal(
      document.getElementById("kosarMegnevezesModal")
    );
    nameModal.show();
    $("#kosarMegnevezesModal").modal();
    console.log("jaarok itt egzaaltalaan<<<<<<<<<<<<<<<<<<<");
    /* const kosarMegnevezesId =
            document.getElementById("kosarMegnevezesId");
          kosarMegnevezesModalNev.innerHTML = "";
          for (kosar of state.kosarNevekOnly) {
            kosarMegnevezesModalNev.innerHTML += kosar.kosarMegnevezes + "<br>";
          }
          kosarMegnevezesModalNev.innerHTML = kosarMegnevezesModalNev.innerHTML;
          nameInput.addEventListener("input", function () {
            okButton.disabled = this.value.length < 3;
          });
          okButton.addEventListener("click", function () {
            alert("Üdvözöljük, " + nameInput.value + "!");
            //HACK: Itt további műveletek végezhetők a névvel

            //HACK: Itt további műveletek végezhetők a névvel
          }); */
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const nameInput = document.getElementById("nameInput");
  const okButton = document.getElementById("okButton");
  let nameModal;
  nameModal = new bootstrap.Modal(
    document.getElementById("kosarMegnevezesModal")
  );
  nameModal.show();
  $("#kosarMegnevezesModal").modal();
  console.log("jaarok itt egzaaltalaan<<<<<<<<<<<<<<<<<<<");
});
nameModal.show();
