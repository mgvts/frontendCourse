// Напишите функцию, которая принимает на вход объект и возвращает его копию

// В объекте в качестве значений могут присутствовать только примитивы, массивы и объекты
//  (функций, Date object, классов и т.д. нет)

type kkey =
    | string
    | symbol
    | number

type primitive =
    | string
    | null
    | undefined
    | kkey


type oobj = {[key: kkey]: primitive | primitive[] | oobj};

function deepClone(obj: oobj): oobj {
    function cloneVal(v) {
        let value = v
        if (Array.isArray(value)) {
            return value.map((e) => cloneVal(e))
        }

        if (typeof value == 'object'){
            if (value == null){
                return  null
            }
            return deepClone(value as oobj)
        }
        return value
    }
    // JSON.parse(JSON.stringify(obj));
    // https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
    let clonned = {} as oobj
    for (let key in obj) {
        clonned[key] = cloneVal(obj[key])
    }
    return clonned;
}

let obj1 = {
    a:1,
    b:'str',
    l: ['liist', {}],
    'null': null,
    'und': undefined,
    o: {
        1:'a',
        2:{
            11:'deeep'
        }
    }
} as oobj

let cl = deepClone(obj1)
cl['some'] = 321
obj1['l'][1]['a'] = '123'
console.log(cl)
console.log(obj1)
console.log((cl['l'] as []).length)
console.log((obj1['l'] as []).length)

