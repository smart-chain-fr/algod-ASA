# Algorand fidly


1. [Installation](#installation)
    1. [Conditions](#condition)
    2. [Récupération de token](#recupérationtk)
2. [Fonctions](#fonction)
    1. [Demo main.js](#main)
    2. [Création compte Wallet](#CrWallet)
    3. [Création ASA](#CrASA)
    4. [Atomic transfert (ASA & NFT)](#Atomic)
    5. [Enregistrement de l'image dans IPFS](#IPFS)
    6. [Création de NFT](#NFT)


# Installation <a name="installation"></a>
Node JS requis
faire la manipulation :
```sh
export NODE_ENV=source
```

## Conditions <a name="condition"></a>
Explorer pour vérifier sa transaction : [testnet.algoexplorer](https://testnet.algoexplorer.io/)  

## Récupération de token <a name="recupérationtk"></a>
Faucet pour récupérer des tokens : [testnet.algorand.network](https://bank.testnet.algorand.network/)

=======

# Fonctions <a name="fonction"></a>

## Demo main.js <a name="main"></a>
```sh
node main.js
```
## Création compte Wallet <a name="CrWallet"></a>

```js
createAccount.createAccount()
```
Cette fonction ne prend aucun paramètre et renverra la clé mnémonique du compte créé ainsi que sa clé publique. La clé mnemonique doit être stockée afin de la réutiliser plus tard notamment pour optin les utilisateurs à de nouveaux ASA.

## Création ASA <a name="CrASA"></a>

```js
createASA.createASA(sk, "TEST", "TST", 210000000, 1, "test..");
```
Cette fonction crée un ASA. Elle prend en paramètre la clé mnemonique du créateur du token `sk`, le nom du token `TEST`, le nom d'une unité de ce token `TST`, la quantité totale ce token `210000000` et une description `"test..."`.

## Atomic transfert (ASA & NFT) <a name="Atomic"></a>


```js
atomic.atomic(sk,account,newASA.ASA_ID,10)
```

```js
atomic.atomic(sk,account,newNFT.NFT_ID,1)
```

La fonction atomic transfer va regrouper 3 transactions. Elle prend en paramètre la clé mnemonique de l'envoyeur d'ASA(/NFT) `sk`, un objet compte (clé mnémonique et adresse publique) `account`, l'identifiant de l'ASA(/NFT) que l'on souhaite envoyer sur le compte `newASA.ASA_ID` (`newNFT.NFT_ID`) ainsi que la quantité `10`(`1`). Le transfer atomic va regrouper l'envoie d'algo, l'optin et l'envoie d'ASA(/NFT). L'avantage d'effectuer un transfert atomique est que si une des 3 transactions ne passe pas aucune ne passera, ce qui évite donc d'envoyer de l'algo ou de payer des frais pour rien.

## Enregistrement de l'image dans IPFS <a name="IPFS"></a>

```js
saveFile.saveIpfs(filename)
```

Cette fonction ajoute l'image ```filename``` à la blockchain ipfs et nous rend sous forme de string le CID (content identifier) pour acceder à l'image .

pour verifier que l'image est bien enregistrée (utiliser le lien sur un navigateur):
    `https://ipfs.io/ipfs/YOUR_IPFS_CID`

## Création de NFT <a name="NFT"></a>

```js
createNFT.createNFT(sk,"NFTTEST","NFTT",cid)
```
Cette fonction crée un NFT avec une image enregistrée dans IPFS. Elle prend en paramètre la clé mnemonique du créateur du token `sk`, le nom du token `NFTTEST`, le nom d'une unité de ce token `NFTT` et le cid du fichier sauvegardé sur IPFS  `cid` du NFT  sera séparé en deux pour que le l'image soit lié au NFT.Une partie du lien sera toujours une URL et l'autre partie  hashée .
