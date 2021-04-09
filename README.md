# Algorand ASA Fidly

## Installation : Faire

```export NODE_ENV=source```

## Demo main.js

```node main.js```

## Fonction création compte Wallet

```createAccount.createAccount()```
Cette fonction ne prend aucun paramètre et renverra la clé mnémonique du compte créé ainsi que sa clé publique. La clé mnemonique doit être stockée afin de la réutiliser plus tard notamment pour optin les utilisateurs à de nouveaux ASA.

## Fonction création ASA

```createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");```
Cette fonction crée un ASA. Elle prend en paramètre la clé mnemonique du créateur du token `sk`, le nom du token `TEST`, le nom d'une unité de ce token `tst`, la quantité totale ce token `210000000` et une description `"test..."`.

## Fonction Atomic transfert

```atomic.atomic(sk,account,newASA.ASA_ID,10).catch(e=>{console.log(e)})```
La fonction atomic transfer va regrouper 3 transactions. Elle prend en paramètre la clé mnemonique de l'envoyeur d'ASA `sk`, un objet compte (clé mnémonique et adresse publique) `account`, l'identifiant de l'ASA que l'on souhaite envoyer sur le compte `newASA.ASA_ID` ainsi que la quantité `10`. Le transfer atomic va regrouper l'envoie d'algo, l'optin et l'envoie d'ASA. L'avantage d'effectuer un transfert atomique est que si une des 3 transactions ne passe pas aucune ne passera, ce qui évite donc d'envoyer de l'algo ou de payer des frais pour rien.
