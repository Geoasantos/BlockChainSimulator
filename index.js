var SHA256 = require("crypto-js/sha256");

let sistema = {
  blockchain: [],
  dificultad: "000",
  primerBloque: function () {
    let genesis = this.crearBloque("Primer Bloque", "");
    genesis.hash = this.crearHash(genesis);
    this.blockchain.push(genesis);
  },
  crearHash(bloque) {
    return SHA256(
      bloque.index +
        bloque.fecha +
        JSON.stringify(bloque.datos) +
        bloque.hashPrevio +
        bloque.nonce
    ).toString();
  },
  crearBloque(data, hashPrevio) {
    let bloque = {
      index: this.blockchain.length + 1,
      fecha: new Date(),
      hashPrevio: hashPrevio,
      hash: "",
      nonce: 0,
      datos: data,
    };
    return bloque;
  },
  agregarBloque: function (datos) {
    let previo = this.blockchain[this.blockchain.length - 1];
    let block = this.crearBloque(datos, previo.hash);
    //mindando
    block = this.minarBloque(block);

    this.blockchain.push(block);
  },
  minarBloque: function (bloque) {
    // let bloquehas=bloque.hash.toString();
    while (!bloque.hash.toString().startsWith(this.dificultad)) {
      bloque.nonce++;
      bloque.hash = this.crearHash(bloque);
    }

    return bloque;
  },
  validarCadena: function () {
    for (let i = 1; i < this.blockchain.length; i++) {
      let previoblock = this.blockchain[i - 1];
      let currBlock = this.blockchain[i];

      if (currBlock.hashPrevio != previoblock.hash) {
        console.error(
          "Error Hash Previo no coincide del bloque" + currBlock.index
        );
        return false;
      }
      if (this.crearHash(currBlock) != currBlock.hash) {
        console.error("Error el Hash no es correcto");
        return false;
      }
    }
    return true;
  },
};

sistema.primerBloque();
sistema.agregarBloque({ Transaccion: "$2" });

sistema.agregarBloque({ Transaccion: "$6" });

sistema.agregarBloque({ Transaccion: "$10" });

sistema.agregarBloque({ Transaccion: "$5" });

//console.log(sistema.validarCadena());
//sistema.blockchain[1].datos = { Transaccion: "$1" };
console.log(sistema.validarCadena());
console.log(JSON.stringify(sistema.blockchain, null, 2));
