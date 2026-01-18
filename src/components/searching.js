import { rules, createComparison } from "../lib/compare.js";

/**
 * Инициализация поиска по таблице
 * @param {string} searchField - имя поля формы поиска
 * @returns {Function} - функция для применения поиска к данным
 */
export function initSearching(searchField) {
    // Создаём компаратор только с правилом поиска по нужным колонкам
    const compare = createComparison([
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    ]);

    // Возвращаем функцию, которая принимает данные, состояние и событие
    return (data, state, action) => {
        // Фильтруем данные по введённому поиску
        return data.filter(row => compare(row, state));
    };
}