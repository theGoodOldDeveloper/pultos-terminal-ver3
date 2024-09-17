-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Sze 17. 11:34
-- Kiszolgáló verziója: 10.4.28-MariaDB
-- PHP verzió: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `pultosterminal`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `alapanyagok`
--

CREATE TABLE `alapanyagok` (
  `id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL,
  `mertekegyseg` varchar(10) DEFAULT NULL COMMENT '''liter vagy darab''',
  `kiszereles` decimal(7,2) DEFAULT NULL COMMENT 'ha darab = 1',
  `leltarozando` int(1) DEFAULT NULL,
  `kritikus` int(11) DEFAULT NULL,
  `gyujto` int(11) DEFAULT NULL,
  `keszlet` int(11) DEFAULT NULL,
  `beszar` int(11) DEFAULT NULL,
  `keszletsum` decimal(10,2) DEFAULT NULL COMMENT 'keszlet * kiszereles',
  `visible` tinyint(4) DEFAULT 1,
  `emailsend` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `forgalom`
--

CREATE TABLE `forgalom` (
  `id` int(11) NOT NULL,
  `transaction_id` int(11) NOT NULL,
  `termekid` int(11) DEFAULT NULL,
  `db` int(11) DEFAULT NULL,
  `eladottbeszar` int(11) DEFAULT NULL,
  `eladottelar` int(11) DEFAULT NULL,
  `eladottdate` varchar(45) DEFAULT NULL,
  `xkimeresnevid` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL COMMENT 'A pultban kiszolgált termékek',
  `elar` int(11) DEFAULT NULL COMMENT 'A pultos eladási ár',
  `visible` tinyint(4) DEFAULT 1,
  `urtartalom` decimal(7,2) DEFAULT NULL COMMENT 'A termékhez felhasznált mennyiség',
  `btncolor` int(11) DEFAULT NULL COMMENT 'képernyő sorrend',
  `visiblesequence` int(11) DEFAULT NULL COMMENT 'A képernyőn megjelenő sorrend',
  `emailsend` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek_has_alapanyagok`
--

CREATE TABLE `termekek_has_alapanyagok` (
  `termek_id` int(11) DEFAULT NULL,
  `alapanyag_id` int(11) DEFAULT NULL,
  `felhasznaltmennyiseg` decimal(7,2) DEFAULT NULL COMMENT 'EZ lesz a jó felhasznált me.',
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `transactions`
--

CREATE TABLE `transactions` (
  `id` int(11) NOT NULL,
  `trnumber` varchar(45) DEFAULT NULL,
  `trdate` varchar(45) DEFAULT NULL,
  `trfizetesmod` varchar(45) DEFAULT NULL,
  `megjegyzes` varchar(100) DEFAULT NULL,
  `pultos` int(11) DEFAULT NULL,
  `kibeosszeg` int(11) DEFAULT NULL,
  `kibeosszegbeszar` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `alapanyagok`
--
ALTER TABLE `alapanyagok`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `forgalom`
--
ALTER TABLE `forgalom`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_forgalom_transactions1_idx` (`transaction_id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `termekek_has_alapanyagok`
--
ALTER TABLE `termekek_has_alapanyagok`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_termekek_has_alapanyagok_alapanyagok1_idx` (`alapanyag_id`),
  ADD KEY `fk_termekek_has_alapanyagok_termekek1_idx` (`termek_id`);

--
-- A tábla indexei `transactions`
--
ALTER TABLE `transactions`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `alapanyagok`
--
ALTER TABLE `alapanyagok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `forgalom`
--
ALTER TABLE `forgalom`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `termekek_has_alapanyagok`
--
ALTER TABLE `termekek_has_alapanyagok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `transactions`
--
ALTER TABLE `transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `forgalom`
--
ALTER TABLE `forgalom`
  ADD CONSTRAINT `fk_forgalom_transactions1` FOREIGN KEY (`transaction_id`) REFERENCES `transactions` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Megkötések a táblához `termekek_has_alapanyagok`
--
ALTER TABLE `termekek_has_alapanyagok`
  ADD CONSTRAINT `fk_termekek_has_alapanyagok_alapanyagok1` FOREIGN KEY (`alapanyag_id`) REFERENCES `alapanyagok` (`id`),
  ADD CONSTRAINT `fk_termekek_has_alapanyagok_termekek1` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
