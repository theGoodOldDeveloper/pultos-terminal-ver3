import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed-top navbar navbar-expand-sm bg-light navbar-dark d-flex justify-content-around">
      <div>
        <form action="/alapanyagok">
          <button type="submit" className="btn btn-info">
            Alapanyagok
          </button>
        </form>
      </div>
      <div>
        <form action="/termekek-adatlap" method="get">
          <button type="submit" className="btn btn-info">
            Termék adatok
          </button>
        </form>
      </div>
      <div>
        <form action="/todo" method="get">
          <button type="submit" className="btn btn-info">
            Teendők
          </button>
        </form>
      </div>
      <div>
        <form action="/admin" method="get">
          <button type="submit" className="btn btn-danger">
            Statisztikák
          </button>
        </form>
      </div>
      <div>
        <form action="/forgalom" method="get">
          <button type="submit" className="btn btn-info">
            Forgalom
          </button>
        </form>
      </div>
      <div>
        <form action="/visibleOrder" method="get">
          <button className="btn btn-dark" id="visibleOrder">
            Sorrend változtatás
          </button>
        </form>
      </div>
      <div>
        <form action="/pultosokadmin" method="get">
          <button type="submit" className="btn btn-dark">
            Pultos admin
          </button>
        </form>
      </div>
      <div>
        <form action="/" method="get">
          <button type="submit" className="btn btn-danger">
            Kilépés
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
