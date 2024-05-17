
class Deck {
  #cardData = null;
  #currCard = 0;
  constructor() { }

  async #initializeIfNeeded() {
    if (this.#cardData == null) {
      this.#cardData = await parseCards("carddata/example.csv", 0);
    }
  }

  async prevCard() {
    await this.#initializeIfNeeded();
    this.#currCard = Math.max(0, this.#currCard - 1);
  }

  async nextCard() {
    await this.#initializeIfNeeded();
    this.#currCard = Math.min(this.#cardData.length, this.#currCard + 1)
  }

  async shuffle() {
    await this.#initializeIfNeeded();
    this.#cardData = shuffle(this.#cardData, Math.random());
    this.#currCard = 0;
  }

  async displayCard() {
    await this.#initializeIfNeeded();
    let cardHTML = "";
    const card = this.#cardData[this.#currCard];
    // TODO: avoid diretly parsing questions as html - this is a security issue
    cardHTML += `
        <div class="questions">
          ${card.questions.map((question) => `<div>${question}</div>`).join("\n")}
        </div>
        <div class="bottom">
          ${card.bottomText}
        </div>
      `;
    $("#carddiv").html(cardHTML);
    $("#next").html("Next (" + (this.#currCard + 1) + "/" + this.#cardData.length + ")");
    if (this.#currCard == 0) {
      $("#previous").css("background-color", "#ffb685")
    }
    else (
      $("#previous").css("background-color", $("#shuffle").css("background-color"))
    )
    if (this.#currCard == this.#cardData.length - 1) {
      $("#next").css("background-color", "#ffb685")
    }
    else (
      $("#next").css("background-color", $("#shuffle").css("background-color"))
    )
  }
}



$(document).ready(async function () {
  var deck = new Deck();
  await deck.displayCard();
  $("#previous").on('click', async function () {
    deck.prevCard();
    await deck.displayCard();
  });
  $("#next").on('click', async function () {
    deck.nextCard();
    await deck.displayCard();
  });
  $("#shuffle").on('click', async function () {
    deck.shuffle();
    await deck.displayCard();
  });
});
