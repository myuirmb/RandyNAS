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
            }
        }
    }

    init(path, gt) {
        let headers = null;
        const token = gt().get('auth').get('tk');
        if (token) headers = { headers: { Authorization: `Bearer ${token}` } };
        return { url: `/api${this.options.service.interface[path]}`, ...headers };
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