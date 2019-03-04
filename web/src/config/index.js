class Config {
    constructor() {
        this.options = {
            service: {
                url: 'http://localhost:13579',
                interface: {
                    init: '/init',
                    login: '/login',
                    menu: '/menu',
                    files: '/files',
                    download: '/dl',
                    upload: '/ul',
                    newfolder: '/nf'
                }
            },
            upload: {
                limit: 1024 * 1024 * 100 // 50M
            }
        }
    }

    init(path, gt) {
        let headers = null;
        const token = gt().get('auth').get('tk');
        if (token) headers = { headers: { Authorization: `Bearer ${token}` } };
        return { url: `/api${this.options.service.interface[path]}`, ...headers };
    }

    ul(){
        return this.options.upload.limit;
    }
}

export default Config;

// const config={
//     service: {
//         url: 'http://localhost:13579',
//         interface: {
//             init: '/init',
//             login: '/login',
//             menu: '/menu',
//             files: '/files',
//             download: '/download'
//         }
//     }
// };

// export default config;