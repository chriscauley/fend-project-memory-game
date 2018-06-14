(function() {
  function resetGame(pass,fail) { load();pass() }
  var DELAY = 600;

  function TestCheatVictory() {
    this.do().route(window.location.pathname+"?cheat")
      .shiftTime("2018-01-01")
      .then(resetGame)
    for (var i=1;i<=16;i++) {
      // delay 600ms every other card since the flip animation is 500 mx
      if (i%2) { this.wait(DELAY) }
      // click next card
      this.click(".card:nth-child("+i+")")
      // check results every row
      if (i%4 == 0) { this.checkResults(".deck"); }
      if (i == 15) {
        this.shiftTime(20,"seconds").wait(1100)
          .checkResults(".score-panel")
      }
    }
    this.done()
  }

  function TestWrongCard() {
    this.do().route(window.location.pathname+"?cheat")
      .then(resetGame)
      .click(".card:nth-child(1)")
      .click(".card:nth-child(3)")
      .checkResults(".deck")
      .wait(DELAY*3)
      .checkResults()
      .done()
  }
  konsole.addCommands(TestCheatVictory, TestWrongCard)
})()