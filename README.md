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
Cette fonction crée un ASA. Elle prend en paramètre la clé mnemonique du créateur du token `sk`, le nom du token `TEST`, le nom d'une unité de ce token `TST`, la quantité totale ce token `210000000` et une description `"test..."`.

## Fonction Atomic transfert (ASA & NFT)

```atomic.atomic(sk,account,newASA.ASA_ID,10)```

```atomic.atomic(sk,account,newNFT.NFT_ID,1)```

La fonction atomic transfer va regrouper 3 transactions. Elle prend en paramètre la clé mnemonique de l'envoyeur d'ASA(/NFT) `sk`, un objet compte (clé mnémonique et adresse publique) `account`, l'identifiant de l'ASA(/NFT) que l'on souhaite envoyer sur le compte `newASA.ASA_ID` (`newNFT.NFT_ID`) ainsi que la quantité `10`(`1`). Le transfer atomic va regrouper l'envoie d'algo, l'optin et l'envoie d'ASA(/NFT). L'avantage d'effectuer un transfert atomique est que si une des 3 transactions ne passe pas aucune ne passera, ce qui évite donc d'envoyer de l'algo ou de payer des frais pour rien.

## Fonction enregistrement de l'image dans IPFS

```saveFile.saveIpfs(filename)```

Cette fonction ajoute l'image ```filename``` à la blockchain ipfs et nous rend sous forme de string le CID (content identifier) pour acceder à l'image .

pour verifier que l'image est bien enregistrée (utiliser le lien sur un navigateur):
    `https://ipfs.io/ipfs/YOUR_IPFS_CID`


## Fonction création de NFT

```createNFT.createNFT(sk,"NFTTEST","NFTT",cid)```
Cette fonction crée un NFT avec une image enregistrée dans IPFS. Elle prend en paramètre la clé mnemonique du créateur du token `sk`, le nom du token `NFTTEST`, le nom d'une unité de ce token `NFTT` et le cid du fichier sauvegardé sur IPFS  `cid` du NFT  sera séparé en deux pour que le l'image soit lié au NFT.Une partie du lien sera toujours une URL et l'autre partie  hashée .
