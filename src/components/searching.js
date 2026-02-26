/**
 * Инициализация поиска по таблице
 * @param {string} searchField - имя поля формы поиска
 * @returns {Function} - функция для применения поиска к данным
 */
export function initSearching(searchField) {
    // Создаём компаратор только с правилом поиска по нужным колонкам
    

    // Возвращаем функцию, которая принимает данные, состояние и событие
    return (query, state, action) => { // result заменили на query
        return state[searchField] ? Object.assign({}, query, { // проверяем, что в поле поиска было что-то введено
            search: state[searchField] // устанавливаем в query параметр
    }) : query; // если поле с поиском пустое, просто возвращаем query без изменений
} 
}