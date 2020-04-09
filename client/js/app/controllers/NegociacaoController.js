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
  }

  adiciona(event) {
    event.preventDefault();

    this._listaNegociacoes.adiciona(this._criaNegociacao());
    this._mensagem.texto = "Negociação adicionada com sucesso";
    this._limpaFormulario();
  }

  importaNegociacoes() {
    let service = new NegociacaoService();

    service.obterNegociacoesDaSemana((err, negociacaoes) => {
      if (err) {
        this._mensagem = console.error();
        return;
      }

      negociacaoes.forEach((negociacao) => {
        this._listaNegociacoes.adiciona(negociacao);
        this._mensagem.texto = "Negociações importadas com sucesso";
      });
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
    this._listaNegociacoes.esvazia();
    this._mensagem.texto = "Negociações apagadas com sucesso";
  }
}
