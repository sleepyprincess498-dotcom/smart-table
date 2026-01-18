import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // ========================
    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
    // ========================

    // Шаблоны "до" таблицы — вставляем prepend в обратном порядке
    before?.slice().reverse().forEach(id => {
        const block = cloneTemplate(id);             // клонируем шаблон
        root.container.prepend(block.container);     // вставляем перед таблицей
        root[id] = block;                             // сохраняем в root для доступа
    });

    // Шаблоны "после" таблицы — вставляем append в обычном порядке
    after?.forEach(id => {
        const block = cloneTemplate(id);            // клонируем шаблон
        root.container.append(block.container);     // вставляем после таблицы
        root[id] = block;                            // сохраняем в root для доступа
    });
    // @todo: #1.3 —  обработать события и вызвать onAction()

    root.container.addEventListener('change', () => {
        onAction();
    });

    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction(), 0);
    })

    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    })
    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);

            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });

            return row.container; 
        });

        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}

