import {sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    let field = null;
    let order = null;

    return (query, state, action) => {

        if (action && action.name === 'sort') {

            action.dataset.value = sortMap[action.dataset.value];  // новое состояние
            field = action.dataset.field;                          // поле для сортировки
            order = action.dataset.value;                      // текущее состояние сортировки

            action.dataset.order = order;

            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';                // сброс состояния
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки
            columns.forEach(column => {                        // Перебираем все наши кнопки сортировки
                if (column.dataset.value !== 'none') {        // Ищем ту, что находится не в начальном состоянии (предполагаем, что одна)
                    field = column.dataset.field;            // Сохраняем в переменных поле
                    order = column.dataset.value;            // и направление сортировки
                }
            }); 
        }

        const sort = (field && order !== 'none') ? `${field}:${order}` : null;
        return sort ? Object.assign({}, query, { sort }) : query;
    }
}