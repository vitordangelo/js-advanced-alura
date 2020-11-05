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

  obterNegociacoes() {
    return Promise.all([
      this.obterNegociacoesDaSemana(),
      this.obterNegociacoesDaSemanaAnterior(),
      this.obterNegociacoesDaSemanaRetrasada(),
    ])
      .then((periodos) => {
        let negociacoes = periodos
          .reduce((dados, periodo) => dados.concat(periodo), [])
          .map(
            (dado) =>
              new Negociacao(new Date(dado.data), dado.quantidade, dado.valor)
          );
        console.log(negociacoes);
        return negociacoes;
      })
      .catch((erro) => {
        console.log(erro)
        throw new Error("Não foi possível obter as negociações");
      });
  }

  cadastra(negociacao) {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.adiciona(negociacao))
      .then(() => "Negociacao adicionada com sucesso")
      .catch((erro) => {
        console.log(erro)
        throw new Error("Não foi possível adicionar negociação");
      });
  }

  lista() {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.listaTodos())
      .catch((erro) => {
        console.log(erro);
        throw new Error("Não foi possível listar as negociações");
      });
  }

  apaga() {
    return ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.apagaTodos())
      .then(() => "Negociações apagadas com sucesso")
      .catch((erro) => {
        console.log(erro);
        throw new Error("Não foi possível apagar as negociações");
      });
  }
}
