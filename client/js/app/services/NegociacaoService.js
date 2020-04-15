class NegociacaoService {
  constructor() {
    this._http = new HttpService();
  }

  obterNegociacoesDaSemana() {
    return new Promise((resolve, reject) => {
      this._http
        .get("negociacoes/semana")
        .then((negociacoes) => {
          console.log(negociacoes);
          resolve(
            negociacoes.map(
              (objeto) =>
                new Negociacao(
                  new Date(objeto.data),
                  objeto.quantidade,
                  objeto.valor
                )
            )
          );
        })
        .catch((err) => {
          console.log(err);
          reject("Não foi possível obter as negociações da semana");
        });
    });
  }

  obterNegociacoesDaSemanaAnterior() {
    return new Promise((resolve, reject) => {
      this._http
        .get("negociacoes/anterior")
        .then((negociacoes) => {
          console.log(negociacoes);
          resolve(
            negociacoes.map(
              (objeto) =>
                new Negociacao(
                  new Date(objeto.data),
                  objeto.quantidade,
                  objeto.valor
                )
            )
          );
        })
        .catch((err) => {
          console.log(err);
          reject("Não foi possível obter as negociações da semana anterior");
        });
    });
  }

  obterNegociacoesDaSemanaRetrasada() {
    return new Promise((resolve, reject) => {
      this._http
        .get("negociacoes/retrasada")
        .then((negociacoes) => {
          console.log(negociacoes);
          resolve(
            negociacoes.map(
              (objeto) =>
                new Negociacao(
                  new Date(objeto.data),
                  objeto.quantidade,
                  objeto.valor
                )
            )
          );
        })
        .catch((err) => {
          console.log(err);
          reject("Não foi possível obter as negociações da semana retrasada");
        });
    });
  }
}
