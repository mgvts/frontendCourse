const storage = {
  // хранилище кладовки
  store: new Map(),

  // добавляет зелье на указанную полку, метод ничего не возвращает
  add: function (shelveName, potion) {
    if (this.store.has(shelveName)) {
      let prev = this.store.get(shelveName)
      prev = [...prev, potion]
      this.store.set(shelveName, prev)
      return
    }
    this.store.set(shelveName, [potion]);
  },

  // Возвращает зелье, если оно есть на любой из полока. Зелье убирается из клдовки (с любой из полок, где есть зелье)
  takePotion: function (namePotion) {
    for (const entry of this.store.entries()) {
      let ind
      const r = entry[1].find((v, i) => {
        ind = i
        return v.name === namePotion
      })

      if (r !== undefined) {
        let prev = this.store.get(entry[0])
        prev.splice(ind, 1)
        this.store.set(entry[0], prev)
        return r
      }
    }
  },

  // Использует зелье (вызывая у него функцию "use"). Зелье убирается из кладовки (с любой из полок, где есть зелье).
  usePotion: function (namePotion) {
    let pot = this.takePotion(namePotion)
    if (pot !== undefined) {
      pot.use()
    }
  },

  // Возвращает все зелья с полки. Содержимое полки не меняется
  getAllPotionsFromShelve: function (shelveName) {
    return this.store.get(shelveName)
  },

  // Возвращает все зелья кладовки. Содержимое полок не меняется
  getAllPotions: function () {
    let r = []
    for (let val of this.store.values()) {
      r = [...r, ...val]
    }
    return r
  },

  // Возвращает все зелья с полки. Полка остается пустой
  takeAllPotionsFromShelve: function (shelveName) {
    if (this.store.has(shelveName)) {
      let r = this.store.get(shelveName)
      this.store.set(shelveName, [])
      return r
    }
  },

  // Использует все зелья с указанной полки. Полка остается пустой
  useAllPotionsFromShelve: function (shelveName) {
    if (this.store.has(shelveName)) {
      this.takeAllPotionsFromShelve(shelveName).forEach(p => p.use())
    }
  },

  // Возвращает зелья с истекшим сроком хранения. Метод убирает такие зелья из кладовки.
  // revisionDay - день (Date), в который происходит проверка сроков хранения
  clean: function (revisionDay) {
    const addDay = (val) => {
      let endedDate = new Date(val.created)
      endedDate.setDate( endedDate.getDate() + val.expirationDays)
      return endedDate
    }

    let overdue = []
    for (let entry of this.store.entries()) {
      let cool = entry[1].filter(val => addDay(val) > revisionDay)
      // console.log(entry[p])
      overdue = [...overdue,
        ...entry[1].filter(val => addDay(val) <= revisionDay)]
      // console.log(overdue)

      this.store.set(entry[0], cool)
    }
    return overdue
  },

  // возвращает число - сколько уникальных названий зелий находится в кладовке
  uniquePotionsCount() {
    return new Set(Array.from(this.store.entries())
        .map(e => e[1].map(p => p.name))
        .reduce((acc, v, ind) => acc.concat(v), [])).size
  }
}

function makePotionsRoom() {
  return storage
}


const potionsRoom = makePotionsRoom();

const potion1 = {
  name: '1',
  expirationDays: 5,
  created: new Date(2023, 0, 1),
  use: function () {
    console.log('Использован любовный напиток');
  }
}
const potion2 = {
  name: '2',
  expirationDays: 5,
  created: new Date(2023, 0, 1),
  use: function () {
    console.log('Использован любовный напиток');
  }
}
const potion3 = {
  name: '3',
  expirationDays: 5,
  created: new Date(2023, 0, 30),
  use: function () {
    console.log('Использован любовный напиток');
  }
}

potionsRoom.add('Дальняя полка1', potion1);
potionsRoom.add('Дальняя полка2', potion2);
potionsRoom.add('Дальняя полка3', potion3);

console.log(potionsRoom.clean(new Date(2023, 0, 20))); // 0;
console.log(storage.store); // 0;

// console.log(storage.store.get('Дальняя полка1'))
// console.log(storage.store.get('Дальняя полка2'))
// console.log(storage.store.get('Дальняя полка3'))


