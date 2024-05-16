function qTransforms(question) {
  question = question.replace("(tf):", "<b>True or False:</b>");
  question = question.replace("''", '"');
  question = question.replace("'", "\u2019");
  question = question.replace("\\;", ",");
  return question;
}

async function parseCards(file, minRating) {
  const data = await (await fetch(file)).text();
  const bottomText = "Bangarang v0.0 | Card ";
  const x = $.csv.toArrays(data);

  let cardJson = [];
  let i = 0;
  let numCards = 0;
  while (i < x.length) {
    let card = {
      questions: [],
      bottomText: bottomText + (cardJson.length + 1).toString(),
    };
    while (card.questions.length < 3 && i < x.length) {
      // Accept cards with a high enough rating if specified
      if (minRating <= 0 || (x[i].length >= 2 && parseFloat(x[i][1]) >= minRating)) {
        console.log(x[i][0]);
        card.questions.push(qTransforms(x[i][0]));
      }
      ++i;
    }
    if (card.questions.length > 0) {
      cardJson.push(card);
      numCards++;
    }
  }
  for (card of cardJson) {
    card.bottomText += "/" + numCards.toString();
  }
  return cardJson;
}

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

async function generateCards() {
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
  await generateCards()
  await window.print()
}

main();