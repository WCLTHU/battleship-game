    var view={
        displayMessage:function(msg){//方法dispalyMaddage，括号中是参数
          var messageArea=document.getElementById("messageArea");//获取网页中的元素messageArea
          messageArea.innerHTML=msg;//messageArea的innerHTML(写入网页的东西)设置为msg
        },
        displayHit:function(location){
          var cell =document.getElementById(location);//获得猜测位置
          cell.setAttribute("class","hit");//显示hit
        },
        displayMiss:function(location) {
          var cell=document.getElementById(location);//和上面的一样，获得猜测的位置
          cell.setAttribute("class","miss");//显示miss
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
            var index = ship.locations.indexOf(guess);//如果guess包含在location中，就说明集中了战舰
            if (index >= 0) {
              ship.hits[index] = "hit";
              view.displayHit(guess);
              view.displayMessage("HIT!");
              if (this.isSunk(ship)) {
                view.displayMessage("You sank my battleship!");
                this.shipsSunk++;
                for (var i=0; i<model.shipLength;i++){
                  document.getElementById(ship.locations[i]).onclick=function(){};//点击后执行空函数
                }
              }
              return true//击中后返回true
            }
          }
          view.displayMiss(guess);
          view.displayMessage("You missed.");
          return false//如果遍历后没有击中船，就返回false
        },

      isSunk: function(ship){
        var count = 0//定义计数，把0赋值于count
        for (var i = 0 ; i < this.shipLength ; i++){
          if (ship.hits[i]==="hit"){//如果被判定为击中
            count++//计数加1
            for (var a = 0;a <this.shipLength;a++){
              if (count===1){//如果计数为1次
                view.displayHit(ship.locations[a])//改变被击中位置的图片为击中
                var hit_1=document.getElementById(event.target.id)//获得id并赋值于hit_1
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
        for (var i = 0; i < this.numShips; i++) {//这个循环要和生成的战舰数相同
          do {
            locations = this.generateShip();//生成战舰的位置
          } while (this.collision(locations));//检查是否重合，如果重合就要不断改变位置
          this.ships[i].locations = locations;//如果位置可行，就把位置赋值于model.ships中战舰的属性locations
        }
        console.log("Ships array: ");
        console.log(this.ships);
      },

      generateShip: function() {
        var direction = Math.floor(Math.random() * 2);//生成一个0-1的随机数，先取0-1，然后乘2，就是0-2，所以还是0-1以内，maths.floor随机转换0或者1
        var row, col;
        if (direction === 1) {//如果随机出的书是1，就放横的战舰
          row = Math.floor(Math.random() * this.boardSize);//水平战舰可以再任意一行中
          col = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));//为了保证战舰在游戏板内，就需要去掉船的长度
        } else {//如果不是1的话，就放竖的战舰
          row = Math.floor(Math.random() * (this.boardSize - this.shipLength + 1));//同理，为了保证在游戏板之内，要去掉船的长度
          col = Math.floor(Math.random() * this.boardSize);//同理，可以再任何一列
        }
        var newShipLocations = [];//这是新战舰的属性，要建立一个空数组，在其中添加一个位置
        for (var i = 0; i < this.shipLength; i++) {//循环次数是战舰的长度
          if (direction === 1) {
            newShipLocations.push(row + "" + (col + i));//把一个新的位置加入newshiplocations
          } else {
            newShipLocations.push((row + i) + "" + col);//和上面的一样，只不过这段代码是处理垂直的战舰的
          }//每次循环后都会在newshiplength里加上一个单元格
        }
        return newShipLocations;//调用方法，返回
      },
      collision: function(locations) {//location是存放了放在界面上的战舰位置的数组
        for (var i = 0; i < this.numShips; i++) {//迭代游戏板中既有的每艘战舰……
          var ship = this.ships[i];
          for (var j = 0; j < locations.length; j++) {//这段代码是检查locations中的位置是否在现有的locations数组中
            if (ship.locations.indexOf(locations[j]) >= 0) {//使用indexof，如果返回值大于等于零，说明被占据，说明碰撞，返回true
              return true;//从内部循环返回，终止两个循环，退出函数并返回ture
            }
          }
        }
        return false;//未被占据就返回false（）没有发生碰撞
      }
  };

    function parseGuess(guess) {
      //var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
      if (guess === null || guess.length !== 2) {//判断是否为空和长度是否是2
        alert("Oops, please enter a letter and a number on the board.");
      } else {
        firstChar = guess.charAt(0);//取第一个数字为行，赋值于firstchar
        // var row = alphabet.indexOf(firstChar);
        var row = guess.charAt(0);//把第一个数赋值于行
        var column = guess.charAt(1);//取第二个数为列
        if (isNaN(row) || isNaN(column)) {//判断是否是数字
          alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize ||
          column < 0 || column >= model.boardSize) {//判断是否在0-6之间
            alert("Oops, that's off the board!");
          } else {
            return row + column;//如果都正确,就返回row和column
          }
        }
        return null;//如果不是就返回null
      }
  
    var controller = {
      guesses: 0,
      processGuess: function(guess) {//依然在检查是否在0-6之间
        var location = parseGuess(guess);
        if (location) {//如果猜测有效
          this.guesses++;//guesses就会加1
          var hit = model.fire(location);
          if (hit && model.shipsSunk === model.numShips) {//如果击沉的战舰和游戏包含的战舰数事相等，就显示下面一段话
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

    function handleKeyPress(e) {//这段代码是用回车来代替点击按钮
      var fireButton =document.getElementById("fireButton");
      if (e.keyCode === 13) {
        fireButton.click();
        return false;
      }
    }
    window.onload = init;
