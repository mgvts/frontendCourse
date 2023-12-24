// 1
const getNewObjWithPrototype = (obj) => {
  return Object.create(obj)
}

// 2
const getEmptyObj = () => {
  return Object.create(null)
}

// 3
const setPrototypeChain = ({programmer, student, teacher, person}) => {
  const i3 = Object.setPrototypeOf(teacher, person)
  const i2 = Object.setPrototypeOf(student, i3)
  const i1 = Object.setPrototypeOf(programmer, i2)
  return Object.setPrototypeOf({}, i1)
}

// 4
const getObjWithEnumerableProperty = () => {
  return Object.create(null, {
    name: {
      value: 'Alex',
      enumerable: false
    },
    age: {
      value: 18,
      enumerable: true,
    },
    work: {
      value: 'empty',
      enumerable: false
    },
  })
}

// 5
const getWelcomeObject = (person) => {
  return Object.create(person, {
    voice: {
      value: function () {
        return `Hello, my name is ${this.name || ''}. I am ${this.age || ''}.`
      }
    }
  })
}

// 6
class Singleton {
  static owner = {id: undefined}

  constructor(id) {
    Singleton.owner.id = id
    if (Singleton.instance) {
      return Singleton.instance
    }
    Singleton.instance = this
  }

  get id() {
    return Singleton.owner.id
  }

  set id(id) {
    Singleton.owner.id = id
  }
}

// 7
const defineTimes = () => {
  Number.prototype.times = function (callback) {
    const n = this.valueOf();
    for (let i = 1; i <= n; i++) {
      callback(i, n)
    }
  }
}


// 8
const defineUniq = () => {
  // ?
  Object.defineProperty(Array.prototype, 'uniq', {
    get: function () {
      return Array.from(new Set(this))
    }
  })
}

// 9
const defineUniqSelf = () => {
  Object.defineProperty(Array.prototype, 'uniqSelf', {
    get: function () {
      const res = Array.from(new Set(this))
      for (let i = 0; i < this.length; i++) {
        delete this[i]
      }
      this.length = res.length
      for (let i = 0; i < res.length; i++) {
        this[i] = res[i]
      }
      return this
    },
  })
}

let a = getWelcomeObject({
  name: "123",
  age: 321
})
console.log(a)