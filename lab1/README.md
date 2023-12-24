Что требуется сделать
Необходимо реализовать функцию makePotionsRoom, которая возвращает объект кладовки. У объекта есть методы для работы с комнатой (поставить зелье на полку или забрать его).

Зелье имеет вид:

const potion = {  
name: 'Название',  
expirationDays: 5,  
created: new Date(2023, 0, 1), // 1 Января 2023.
use: function() {...},  
};
где:
name - название зелья
expirationDays - срок хранения зелья в днях
created - дата создания зелья
use - случайная функция, которая будет вызвана в момент использования зелья

Что из себя представляет объект кладовки:

const storage = {
// хранилище кладовки
store: new Map(),

    // добавляет зелье на указанную полку, метод ничего не возвращает
    add: function (shelveName, potion) {...}

    // Возвращает зелье, если оно есть на любой из полок. Зелье убирается из кладовки (с любой из полок, где есть зелье)
    takePotion: function (namePotion) {...}

    // Использует зелье (вызывая у него функцию "use"). Зелье убирается из кладовки (с любой из полок, где есть зелье).
    usePotion: function (namePotion) {...}

    // Возвращает все зелья с полки. Содержимое полки не меняется
    getAllPotionsFromShelve: function (shelveName) {...}

    // Возвращает все зелья кладовки. Содержимое полок не меняется
    getAllPotions: function () {...}

    // Возвращает все зелья с полки. Полка остается пустой
    takeAllPotionsFromShelve: function (shelveName) {...}

    // Использует все зелья с указанной полки. Полка остается пустой
    useAllPotionsFromShelve: function (shelveName) {...}

    // Возвращает зелья с истекшим сроком хранения. Метод убирает такие зелья из кладовки.
    // revisionDay - день (Date), в который происходит проверка сроков хранения
    clean: function(revisionDay) {...}

    // возвращает число - сколько уникальных названий зелий находится в кладовке
    uniquePotionsCount() {...}
}
Требуется реализовать все методы кладовки.
В файле с решением нужно экспортировать функцию:

function makePotionsRoom() {
// ...
}

module.exports = makePotionsRoom;
Пример использования

const potionsRoom = makePotionsRoom();

const potion = {
name: 'Амортенция',
expirationDays: 5,
created: new Date(2023, 0, 1),
use: function() {
console.log('Использован любовный напиток');
}
}

potionsRoom.add('Дальняя полка', potion);
potionsRoom.uniquePotionsCount(); // 1;

potionsRoom.useAllPotionsFromShelve('Дальняя полка');
// Использован любовный напиток
potionsRoom.uniquePotionsCount(); // 0;