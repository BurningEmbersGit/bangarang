const backing = `
<div class="page">
  <div class="backing">
    <div>
      ${(() => {
        let result = "";
        for (let i = 0; i < 20; i++) {
          if (i % 2 == 1) {
            result += "           ";
          }
          for (let i = 0; i < 7; i++) {
            result += "Bangarang      ";
          }
          result += "\n\n";
        }
        return result;
      })()}
    </div>
  </div>
</div>
`;

async function displayCards() {
  const cardData = await parseCards("carddata/example.csv", 0);
  const fancyborder = true;
  const doBackground = true;
  const doBacks = true;
  const cardsPerPage = 9;

  for (let i = 0; i < cardData.length; i += cardsPerPage) {
    // Construct one page at a time
    // TODO: use a grid rather than a flexbox for the cards
    let cardHTML = "";
    for (let j = 0; j < cardsPerPage && i + j < cardData.length; ++j) {
      const card = cardData[i + j];
      // TODO: avoid diretly parsing questions as html - this is a security issue
      cardHTML += `
        <div class="card ${fancyborder ? "fancyborder" : ""}">
          <div class="questions">
            ${card.questions.map((question) => `<div>${question}</div>`).join("\n")}
          </div>
          <div class="bottom">
            ${card.bottomText}
          </div>
        </div>
      `;
    }
    let cardPage = `
      <div class="page">
        <div class="cards">
          ${doBackground ? '<img src="images/background-color.png">' : ""}
          <div> ${cardHTML} </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", cardPage);
    if (doBacks) {
      document.body.insertAdjacentHTML("beforeend", backing);
    }
  }
}

async function main() {
  await displayCards();
  window.print();
}

main();
