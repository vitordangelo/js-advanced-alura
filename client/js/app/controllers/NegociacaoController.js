class NegociacaoController {
  constructor() {
    let $ = document.querySelector.bind(document);

    this._inputData = $("#data");
    this._inputQuantidade = $("#quantidade");
    this._inputValor = $("#valor");

    this._listaNegociacoes = new Bind(
      new ListaNegociacoes(),
      new NegociacoesView($("#negociacoesView")),
      "adiciona",
      "esvazia"
    );

    this._mensagem = new Bind(
      new Mensagem(),
      new MensagemView($("#mensagemView")),
      "texto"
    );

    ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.listaTodos())
      .then((negociacoes) =>
        negociacoes
          .forEach((negociacao) => this.ListaNegociacoes.adiciona(negociacao))
          .catch((error) => {
            console.log(error);
            this._mensagem = error;
          })
      );
  }

  adiciona(event) {
    event.preventDefault();

    ConnectionFactory.getConnection()
      .then((connection) => {
        let negociacao = this._criaNegociacao();

        new NegociacaoDao(connection).adiciona(negociacao).then(() => {
          this._listaNegociacoes.adiciona(negociacao);
          this._mensagem.texto = "Negociação adicionada com sucesso";
          this._limpaFormulario();
        });
      })
      .catch((erro) => (this._mensagem.texto = erro));
  }

  importaNegociacoes() {
    let service = new NegociacaoService();

    Promise.all([
      service.obterNegociacoesDaSemana(),
      service.obterNegociacoesDaSemana(),
      service.obterNegociacoesDaSemanaRetrasada(),
    ])
      .then((negociacoes) => {
        negociacoes
          .reduce((arrayAchatado, array) => arrayAchatado.concat(array), [])
          .forEach((negociacao) => {
            this._listaNegociacoes.adiciona(negociacao);
          });
        this._mensagem.texto = "Negociações adicionadas com sucesso";
      })
      .catch((err) => {
        console.log(err);
        this._mensagem.texto = err;
      });
  }

  _criaNegociacao() {
    return new Negociacao(
      DateHelper.textParaData(this._inputData.value),
      this._inputQuantidade.value,
      this._inputValor.value
    );
  }

  _limpaFormulario() {
    this._inputData.value = "";
    this._inputQuantidade.value = "";
    this._inputValor.value = "";

    this._inputData.focus();
  }

  apaga() {
    ConnectionFactory.getConnection()
      .then((connection) => new NegociacaoDao(connection))
      .then((dao) => dao.apagaTodos())
      .then((mensagem) => {
        console.log(mensagem);
        this._mensagem.texto = mensagem;
        this._listaNegociacoes.esvazia();
      });
  }
}
