var Sudok = Sudok || {}

Sudok.MAXLEN = 9

Sudok.ShuManage = function () {
  this.oriData = []
  this.id = 1
}

Sudok.ShuManage.prototype.init = function() {
  this.oriData = []
  this.id = 1
  this.generateShu()
  this.generateRelations()
  this.convertToTwoNums()
}

// 生成二维数字数组
Sudok.ShuManage.prototype.generateShu = function() {
  // for (let y = 0; y < 9; y++) {
  //   let tempArr = []
  //   for (let x = 0; x < 9; x++) {
  //     tempArr.push(
  //       new Shu(x, y)
  //     )
  //   }
  //   this.oriData.push(tempArr)
  // }

  for (let y = 0; y < Sudok.MAXLEN; y++) {
    for (let x = 0; x < Sudok.MAXLEN; x++) {
      this.oriData.push(new Sudok.Shu(this.id, x, y))
      this.id++
    }
  }
}

Sudok.ShuManage.prototype.generateRelations = function() {
  this.forEach(shu => {
    shu.genRelation(this)
  })
}

Sudok.ShuManage.prototype.forEach = function(fn) {
  this.oriData.forEach(oneArr => {
    fn && fn(oneArr)
  })
}

Sudok.ShuManage.prototype.get = function(x, y) {
  return this.oriData.find(shu => shu.x === x && shu.y === y)
}

Sudok.ShuManage.prototype.happy = function() {
  this.init()
  
  this.forEach(shu => {
    shu.generateANum()
  })
  
  console.log('generate is avaliable ?', this.checkAvaiable())
  if (!this.checkAvaiable()) {
    this.happy()
  }
  return this.twoNums
}
let g = [{x: 0,y: 0},{x: 1,y: 0},{x: 2,y: 0},{x: 0,y: 1},{x: 1,y: 1},{x: 2,y: 1},{x: 0,y: 2},{x: 1,y: 2},{x: 2,y: 2}]
Sudok.ShuManage.prototype.happy2 = function() {
  this.init()

  for (let i = 1; i <= 9; i++) {
    let tar = [true, true, true, true, true, true, true, true, true]
    let tempPos = []
    // let x = 0
    // let y = 0
    let index = 0
    this.twoNums.forEach((oneArr, k) => {
      index = 0
      let start = Math.floor(Math.random() * g.length)
      while(index < 9) {
        let { x, y } = g[(start + index) % 9]
        console.log(k, x, y, i)
        // oneArr[y * 3 + x].setANum(i)
        if (this.checkPosAvail(k, x, y, i)) {
          oneArr[y * 3 + x].setANum(i)
          // if (!this.group[k]) this.group[k] = []
          // this.group[k].push(i)
          break;
        } else {
          // oneArr[y * 3 + x].resetANum(i)
        }
        index++
        // console.log('while', index)
      }
      if (index >= 9) {
        console.error('error', k, i)
      }
    })
  }

  return this.twoNums
}

Sudok.ShuManage.prototype.checkPosAvail = function(a, x, y, num) {
  let target = this.twoNums[a][y * 3 + x]
  let hasExist = target.relation.some(item => item.aNum === num)
  
  if (target.hasANum) {
    return false
  }

  if (hasExist) {
    return false
  }

  let yy = Math.floor(a / 3) * 3 + y
  let xx = (a % 3) * 3 + x
  console.log(`xx ${xx} yy ${yy}`)
  let availArr = []
  this.twoNums.forEach((oneArr, oneIndex) => {
    if (oneIndex === a) {
      availArr.push(0)
    } else if (oneArr.some(item => item.aNum === num)) {
      availArr.push(0)
    } else {
      let temp = []
      
      // 排除当前行和列的，还没有填写值的，剩下还可以填写当前值的项
      oneArr.forEach(item => {
        // 5 0 0
        // 6,3
        if (!(item.x === xx || item.y === yy)) {
          if (!item.hasANum && item.avaNums[num]) {
            temp.push(item)
          }
        }
      })

      if (temp.length > 0) {
        availArr.push(0)
      }
    }
  })
  
  if (availArr.length !== this.twoNums.length) {
    console.log(a, x, y, num, availArr.length, this.twoNums.length)
    return false
  }

  return true
}

Sudok.ShuManage.prototype.checkOtherNoNumAvail = function(a, x, y, num) {
  let target = this.twoNums[a][y * 3 + x]
  let hasExist = target.relation.some(item => item.aNum === num)

  let availArr = []
  this.twoNums.forEach((oneArr, oneIndex) => {
    // console.log(oneArr.some(item => item.aNum === num),123123)
    if (!oneArr.some(item => item.aNum === num)) {
      let temp = []
      let yy = Math.floor(oneIndex / 3) * 3 + y
      let xx = (oneIndex % 3) * 3 + x
      // 排除当前行和列的，还没有填写值的，剩下还可以填写当前值的项
      oneArr.forEach(item => {
        // 5 0 0
        // 6,3
        if (!(item.x === xx || item.y === yy)) {
          if (!item.hasANum && !item.relation.some(item => item.aNum === num)) {
            temp.push(item)
          }
        }
      })

      if (temp.length > 0) {
        availArr.push(0)
      }
    } else {
      availArr.push(0)
    }
  })
  
  if (availArr.length !== this.twoNums.length) {
    console.log(a, x, y, num, availArr.length, this.twoNums.length)
    return false
  }

  return true
}

Sudok.ShuManage.prototype.checkAvaiable = function() {
  let has = []
  this.forEach(shu => {
    if (!shu.checkAvaiable()) {
      has.push(shu)
    }
  })

  return has.length === 0
}

Sudok.ShuManage.prototype.hasOneRelation = function(x, y) {
  let has = []
  this.forEach(shu => {
    if (shu.relation.some(rel => rel.x === x && rel.y === y)) {
      has.push(shu)
    }
  })

  return has
}

Sudok.ShuManage.prototype.convertToTwoNums = function() {
  let tempArr = {}
  let twoNums = []
  this.forEach(shu => {
    if (!tempArr[shu.group]) {
      tempArr[shu.group] = []
    }
    tempArr[shu.group].push(shu)
  })

  Object.keys(tempArr).forEach(k => {
    twoNums.push(tempArr[k])
  })

  this.twoNums = twoNums
  return twoNums
}