function qTransforms(question) {
  question = question.replace("(tf)", "<b>True or False:</b>");
  question = question.replace("(wr)", "<b>Would I Rather:</b>");
  question = question.replace(/\*[^\*]*\*/g, "<i>$&</i>").replace(/\*/g, "");
  question = question.replace(/''/g, '"');
  question = question.replace("\\;", ",");
  return question;
}

async function parseCards(file, minRating, defaultRating) {
  const data = await (await fetch(file)).text();
  const bottomText = "Bangarang v0.0 | Card ID ";
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
      const useQuestion =
        (x[i].length >= 2 && parseFloat(x[i][1]) >= minRating) || // Has rating
        ((x[i].length < 2 || isNaN(x[i][1])) && defaultRating >= minRating); // No rating

      if (useQuestion) {
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
