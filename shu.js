var Sudok = Sudok || {}

const Default_nums = {1: true,2: true,3: true,4: true,5: true,6: true,7: true,8: true,9: true}

Sudok.Shu = function(id, x, y) {
  this.id = id
  this.x = x
  this.y = y
  this.aNum = null
  this.hasANum = false
  this.avaNums = {...Default_nums}
  this.group = this.calcGroup()
  this.relation = []
}

Sudok.Shu.prototype.getANum = function() {
  return this.aNum
}

Sudok.Shu.prototype.generateANum = function() {
  let temp_arr = []
  Object.keys(this.avaNums).forEach(k => {
    if (this.avaNums[k]) temp_arr.push(k)
  })

  let ii = Math.floor(Math.random() * temp_arr.length)
  if (ii >= temp_arr.length) {
    console.log(temp_arr.length, ii, temp_arr.length > ii)
    // throw new Error('invalid ava num length')
  }
  this.aNum = parseInt(temp_arr[ii])
  this.hasANum = true
  // this.dissANum(num)

  this.relation.forEach(ss => {
    ss.dissANum(this.aNum)
  })
  
  return this.aNum
}

Sudok.Shu.prototype.setANum = function(num) {
  this.aNum = parseInt(num)
  this.hasANum = true

  this.relation.forEach(ss => {
    ss.dissANum(this.aNum)
  })
  
  return this.aNum
}

Sudok.Shu.prototype.resetANum = function(num) {
  this.aNum = null
  this.hasANum = false

  this.relation.forEach(ss => {
    // ss.dissANum(this.aNum)
    ss.avaNums[this.aNum] = true
  })
  
  return this.aNum
}

Sudok.Shu.prototype.avaANum = function(n) {
  return this.avaNums[n]
}

// only one ava num
Sudok.Shu.prototype.checkAvaiable = function(n) {
  let temp_arr = []
  Object.keys(this.avaNums).forEach(k => {
    if (this.avaNums[k]) {
      temp_arr.push(k)
    }
  })

  return temp_arr.length === 1
}

Sudok.Shu.prototype.dissANum = function(n) {
  this.avaNums[n] = false
}

Sudok.Shu.prototype.calcGroup = function() {
  return Math.floor((this.y) / 3 ) * 3  + Math.floor((this.x) / 3 ) * 1
}

Sudok.Shu.prototype.genRelation = function(sm) {
  let rel = []
  // x 不变，y取 1-9
  for (let j = 0; j < Sudok.MAXLEN; j++) {
    if (j !== this.y) {
      // rel.push({ x: this.x, y: j})
      rel.push(sm.get(this.x, j))
    }
  }
  // y 不变，x取 1-9
  for (let i = 0; i < Sudok.MAXLEN; i++) {
    if (i !== this.x) {
      // rel.push({ x: i, y: this.y})
      rel.push(sm.get(i, this.y))
    }
  }
  // 当前组
  sm.forEach(shu => {
    if (shu.group === this.group && (shu.x !== this.x || shu.y != this.y)) {
      if (!rel.some(({ x, y }) => x === shu.x && y === shu.y)) {
        // rel.push({ x: shu.x, y: shu.y })
        rel.push(shu)
      }
    }
  })

  this.relation = rel
  return rel
}