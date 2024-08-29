

// Иммитация получения списка детей с сервера
export function getChildrens() {
    return new Promise((resolve, reject) => {
        try {
            let childrens;

            setTimeout(() => {
                childrens = JSON.parse(localStorage.getItem('childrens'));
                if(!childrens) {
                    localStorage.setItem('childrens', '[]');
                    resolve([]);
                }
                resolve(childrens);
            }, 600);
        } catch (err) {
            reject(err)
        }

    });
}

// Иммитация добавления ребенка в список на сервере
export function updateChildList(childrens) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                localStorage.setItem('childrens', JSON.stringify(childrens));
                resolve(null);
            }, 600);
        } catch (err) {
            reject(err)
        }

    });
}