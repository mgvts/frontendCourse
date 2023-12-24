// Напишите функцию, которая принимает на вход объект и возвращает его копию

// В объекте в качестве значений могут присутствовать только примитивы, массивы и объекты
//  (функций, Date object, классов и т.д. нет)

type kkey = string | symbol | number

type primitive = number
    | null
    | undefined
    | string
    | []

type oobj = {[key: kkey]: primitive};

function deepClone(obj: oobj): oobj {
    // JSON.parse(JSON.stringify(obj));
    // https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
    let clonned = {} as {[key: kkey]: primitive}
    for (let key in obj) {
        clonned[key] = obj[key]
    }
    return clonned;
}

const obj1 = {
    a:1,
    b:'str',
    l: ['liist',
        {'someListObj': 42}],
    o: {
        1:'a',
        2:{
            11:'deeep'
        }
    }
}

let cl = deepClone(obj1)
cl['some'] = 321
console.log(cl)
console.log(obj1)
