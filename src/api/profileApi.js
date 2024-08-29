

export function updateProfileData(data) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                if(data) {
                    localStorage.setItem('owner_data', JSON.stringify(data))
                    resolve(data);
                }
            }, 600);
        } catch (err) {
            reject(err)
        }
    });
}

export function getProfileData() {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve(JSON.parse(localStorage.getItem('owner_data')));
            }, 600);
        } catch (err) {
            reject(err)
        }
    });
}