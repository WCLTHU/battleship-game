    var view={
        displayMessage:function(msg){//方法dispalyMaddage，括号中是参数
          var messageArea=document.getElementById("messageArea");//获取网页中的元素messageArea
          messageArea.innerHTML=msg;//messageArea的innerHTML(写入网页的东西)设置为msg
        },
        displayHit:function(location){
          var cell =document.getElementById(location);//获得猜测位置
          cell.setAttribute("class","hit");//显示hit图像
        },
        displayMiss:function(location) {
          var cell=document.getElementById(location);//和上面的一样，获得猜测的位置
          cell.setAttribute("class","miss");//显示miss图像
        }
      }

    var model = {
      boardSize: 7,//界面的大小
      numShips: 3,//战舰的数量
      shipLength: 3,//战舰的长度
      shipsSunk: 0,//击沉的数量
      ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },//location是随机生成的单元格
              { locations: [0, 0, 0], hits: ["", "", ""] },//而hits是用来存储被击中的部位
              { locations: [0, 0, 0], hits: ["", "", ""] } ],

      fire: function(guess) {
          for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
              ship.hits[index] = "hit";
              view.displayHit(guess);
              view.displayMessage("HIT!");
              if (this.isSunk(ship)) {
                view.displayMessage("You sank my battleship!");
                this.shipsSunk++;
              }
              return true
            }
          }
          view.displayMiss(guess);
          view.displayMessage("You missed.");
          return false
        },

      isSunk: function(ship){
        var count = 0
        for (var i = 0 ; i < this.shipLength ; i++){
          if (ship.hits[i]==="hit"){
            count++
            for (var a = 0;a <this.shipLength;a++){
              if (count===1){
                view.displayHit(ship.locations[a])
                var hit_1=document.getElementById(event.target.id)
                hit_1.style.backgroundImage='url(photo/boom.png)'
              }else {
                view.displayHit(ship.locations[a])
                document.getElementById(ship.locations[a]).style.backgroundImage='url(photo/boom.png)'
                var changeboom=document.getElementById(event.target.id)
                changeboom.style.backgroundImage='url(photo/boom.png)'
              }
            }
          }
        }
        if (count*10 >this.shipLength*6){
          return true;
        }
        return false;
    },



      generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
          do {
            locations = this.generateShip();
          } while (this.collision(locations));
          this.ships[i].locations = locations;
        }
        console.log("Ships array: ");
        console.log(this.ships);
      },

      generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row, col;
        if (direction === 1) {
          row = Math.floor(Math.random() * this.boardSize);
          col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
        } else {
          row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));
          col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
          if (direction === 1) {
            newShipLocations.push(row + "" + (col + i));
          } else {
            newShipLocations.push((row + i) + "" + col);
          }
        }
        return newShipLocations;
      },
      collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
          var ship = this.ships[i];
          for (var j = 0; j < locations.length; j++) {
            if (ship.locations.indexOf(locations[j]) >= 0) {
              return true;
            }
          }
        }
        return false;
      }
  };

    function parseGuess(guess) {
      //var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
      if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
      } else {
        firstChar = guess.charAt(0);
        // var row = alphabet.indexOf(firstChar);
        var row = guess.charAt(0);
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
          alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
          column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board!");
          } else {
            return row + column;
          }
        }
        return null;
      }
  
    var controller = {
      guesses: 0,
      processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
          this.guesses++;
          var hit = model.fire(location);
          if (hit && model.shipsSunk === model.numShips) {
            view.displayMessage("You sank all my battleships, in " +
            this.guesses + " guesses");
          }
        }
      }
    };


    function init() {
      var fireButton = document.getElementById("fireButton");
      fireButton.onclick = handleFireButton;
      var guessInput = document.getElementById("guessInput");
      guessInput.onkeypress = handleKeyPress;
      model.generateShipLocations();
      var TD=document.getElementsByTagName('td')//从html中找到<td>标签
      for(i=0;i<TD.length;i++){//定义i数组从0开始计数；使td的长度大于i；当每次执行一次后i自动加1
        TD[i].onclick=test;//点击td标签的时候，执行test函数
      }
    }
    function test(event){//函数名为test
      var guess = this.id;
      controller.processGuess(guess);
      console.log(event.target.id)//在后台显示点击的td的位置
    }
    function handleFireButton() {
      var guessInput = document.getElementById("guessInput");
      var guess = guessInput.value;
      controller.processGuess(guess);
      guessInput.value = "";
    }

    function handleKeyPress(e) {
      var fireButton =document.getElementById("fireButton");
      if (e.keyCode === 13) {
        fireButton.click();
        return false;
      }
    }
    window.onload = init;
