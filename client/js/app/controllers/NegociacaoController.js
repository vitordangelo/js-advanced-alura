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

    this._init();
  }

  _init() {
    new NegociacaoService()
      .lista()
      .then((negociacoes) =>
        negociacoes.forEach((negociacao) =>
          this._listaNegociacoes.adiciona(negociacao)
        )
      )
      .catch((erro) => {
        console.log(erro);
        this._mensagem.texto = erro;
      });

    setInterval(() => {
      this.importaNegociacoes();
    }, 3000);
  }

  adiciona(event) {
    event.preventDefault();

    let negociacao = this._criaNegociacao();

    new NegociacaoService()
      .cadastra(negociacao)
      .then((mensagem) => {
        this._listaNegociacoes.adiciona(negociacao);
        this._mensagem.texto = mensagem;
        this._limpaFormulario();
      })
      .catch((erro) => {
        console.log(erro);
        this._mensagem.texto = erro;
      });
  }

  importaNegociacoes() {
    let service = new NegociacaoService();
    service
      .obterNegociacoes()
      .then((negociacoes) =>
        negociacoes.filter(
          (negociacao) =>
            !this._listaNegociacoes.negociacoes.some(
              (negociacaoExistente) =>
                JSON.stringify(negociacao) ==
                JSON.stringify(negociacaoExistente)
            )
        )
      )
      .then((negociacoes) =>
        negociacoes.forEach((negociacao) => {
          this._listaNegociacoes.adiciona(negociacao);
          this._mensagem.texto = "Negociações do período importadas";
        })
      )
      .catch((erro) => this._mensagem.texto = erro);
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
    new NegociacaoService()
      .apaga()
      .then((mensagem) => {
        this._mensagem = mensagem;
        this._listaNegociacoes.esvazia();
      })
      .catch((erro) => {
        console.log(erro);
        this._mensagem.texto = erro;
      });
  }
}
