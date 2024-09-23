//BUG COPY PASTE
foundKosar = state.kosarak.length > 0 ? true : false;
if (foundKosar) {
  oldKosarNevek = [];
  oldKosarak = [];
  let oldKosar = true;
  let state = {
    kosarNevek: [],
    kosarak: [],
  };

  function getKosarak() {
    fetch("/api/kosarnevek")
      .then((response) => response.json())
      .then((data) => {
        // Adatok feldolgozása
        const kosarNevekMap = new Map();

        Object.values(data).forEach((item) => {
          const kosarNev = {
            id: item.id,
            kosarMegnevezes: item.kosarMegnevezes,
            kosarMegnevezesIndex: item.kosarMegnevezesIndex,
            kosarMegnevezesPultosNeve: item.kosarMegnevezesPultosNeve,
            kosarMegnevezesPultosKod: item.kosarMegnevezesPultosKod,
            thisId: item.thisId,
          };

          if (!kosarNevekMap.has(item.kosarMegnevezes)) {
            kosarNevekMap.set(item.kosarMegnevezes, kosarNev);
          }

          state.kosarak.push(
            ...item.kosarak.map((kosar) => ({
              ...kosar,
              kosarMegnevezes: item.kosarMegnevezes,
              oldKosar: oldKosar,
            }))
          );
        });
        state.kosarNevek = Array.from(kosarNevekMap.values());

        // Frissítsük a globális változókat
        oldKosarNevek = [...state.kosarNevek];
        oldKosarak = [...state.kosarak];

        renderKosarak();
      })

      .catch((error) => console.error("Hiba a kosarak lekérésekor:", error));
  }
  //NOTE innen -----------------------------
  function renderKosarak() {
    const tableBody = document.getElementById("kosarakTableBody");
    tableBody.innerHTML = "";

    state.kosarNevek.forEach((kosarNev) => {
      const kosarak = state.kosarak.filter(
        (k) => k.kosarMegnevezes === kosarNev.kosarMegnevezes
      );
      const osszesEladasiAr = kosarak.reduce(
        (sum, kosar) => sum + kosar.eladottelar * kosar.db,
        0
      );

      const row = document.createElement("tr");
      row.innerHTML = `
      <td>
      <button class="btn btn-sm btn-info kosaradatokBtn" data-megnevezes="${
        kosarNev.kosarMegnevezes
      }">Kosáradatok</button>
      </td>
        <td>${kosarNev.kosarMegnevezes}</td>
        <td>${kosarNev.kosarMegnevezesIndex}</td>
        <td>${kosarNev.kosarMegnevezesPultosNeve}</td>
        <td class="text-center">${kosarNev.kosarMegnevezesPultosKod}</td>
        <td class="text-right">${osszesEladasiAr.toFixed(0)} Ft</td>
        <td>
          <button class="btn btn-primary kosarNevBtn" data-megnevezes="${
            kosarNev.kosarMegnevezes
          }">PULTRA</button>
          
        </td>
      `;
      tableBody.appendChild(row);
    });

    //HACK Eseménykezelők hozzáadása
    document.querySelectorAll(".kosarNevBtn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const kosarMegnevezes = this.getAttribute("data-megnevezes");
        const aktualKosarNev = state.kosarNevek.find(
          (k) => k.kosarMegnevezes === kosarMegnevezes
        );
        //console.log("kosarMegnevezes", kosarMegnevezes);
        const aktualKosarak = state.kosarak.filter(
          (k) => k.kosarMegnevezes === kosarMegnevezes
        );
        //console.log("aktualKosarak", aktualKosarak);
        kosarbolVisszatoltottId = state.kosarak.findIndex(
          (k) => k.kosarMegnevezes === kosarMegnevezes
        );
        //console.log("kosarbolVisszatoltottId 😊", kosarbolVisszatoltottId);
        $("#kosarakModal").modal("hide");
        renderPult(aktualKosarNev, aktualKosarak);
        //console.log(aktualKosarak);
      });
    });
    //HACK Eseménykezelők hozzáadása

    document.querySelectorAll(".kosaradatokBtn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const kosarMegnevezes = this.getAttribute("data-megnevezes");
        const kosarNev = state.kosarNevek.find(
          (k) => k.kosarMegnevezes === kosarMegnevezes
        );
        const kosarak = state.kosarak.filter(
          (k) => k.kosarMegnevezes === kosarMegnevezes
        );
        renderKosaradatok(kosarak, kosarNev);
        $("#kosaradatokModal").modal("show");
      });
    });
  }
  //NOTE innen -----------------------------
  function renderKosaradatok(kosarak, kosarNev) {
    const modalTitle = document.getElementById("kosaradatokModalLabel");
    modalTitle.textContent = `Kosár adatai - ${kosarNev.kosarMegnevezes}`;

    const tableBody = document.getElementById("kosaradatokTableBody");
    tableBody.innerHTML = "";

    let osszesEladasiAr = 0;

    kosarak.forEach((kosar) => {
      const teljesAr = kosar.eladottelar * kosar.db;
      osszesEladasiAr += teljesAr;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${kosar.nev}</td>
        <td>${kosar.db}</td>
        <td>${kosar.eladottelar.toFixed(2)} Ft</td>
        <td>${teljesAr.toFixed(2)} Ft</td>
        <td>${kosar.fizetesmod}</td>
        <td>${kosar.datum}</td>
      `;
      tableBody.appendChild(row);
    });

    // Összesítő sor hozzáadása
    const osszesitoRow = document.createElement("tr");
    osszesitoRow.innerHTML = `
      <td colspan="3" class="text-right"><strong>Összesen:</strong></td>
      <td><strong>${osszesEladasiAr.toFixed(2)} Ft</strong></td>
      <td colspan="2"></td>
    `;
    tableBody.appendChild(osszesitoRow);
  }
  //NOTE eddig
  // Kosarak modal megjelenítése
  function showKosarakModal() {
    getKosarak();
    $("#kosarakModal").modal("show");
  }

  showKosarakModal();
}
//BUG COPY PASTE
