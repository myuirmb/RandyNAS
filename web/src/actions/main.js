import Request from '../service/request';
import Config from '../config';
import UUID from 'uuid/v4';

export const SHOW_HIDDEN_MASK_TRUE = 'SHOW_HIDDEN_MASK_TRUE';
export const SHOW_HIDDEN_MASK_FALSE = 'SHOW_HIDDEN_MASK_FALSE';

export const SHOW_HIDDEN_DIALOG_TRUE = 'SHOW_HIDDEN_DIALOG_TRUE';
export const SHOW_HIDDEN_DIALOG_FALSE = 'SHOW_HIDDEN_DIALOG_FALSE';

export const SHOW_HIDDEN_LOGIN_TRUE = 'SHOW_HIDDEN_LOGIN_TRUE';
export const SHOW_HIDDEN_LOGIN_FALSE = 'SHOW_HIDDEN_LOGIN_FALSE';

export const CONTENT_SHOW_TYPE = 'CONTENT_SHOW_TYPE';

export const MENU_INIT = 'MENU_INIT';
export const GET_FILES = 'GET_FILES';
export const NEW_FOLDER = 'NEW_FOLDER';
export const UPDATE_PROGRESS = 'UPDATE_PROGRESS';

export function showMask() {
    return { type: SHOW_HIDDEN_MASK_TRUE };
}

export function hiddenMask() {
    return { type: SHOW_HIDDEN_MASK_FALSE };
}

export function showDialog() {
    return { type: SHOW_HIDDEN_DIALOG_TRUE };
}

export function hiddenDialog() {
    return { type: SHOW_HIDDEN_DIALOG_FALSE };
}

export function showLogin() {
    return { type: SHOW_HIDDEN_LOGIN_TRUE };
}

export function hiddenLogin() {
    return { type: SHOW_HIDDEN_LOGIN_FALSE };
}

export function showType(data) {
    return { type: CONTENT_SHOW_TYPE, data };
}

export function menuInit(data) {
    return { type: MENU_INIT, data };
}

export function getFiles(data) {
    return { type: GET_FILES, data };
}

export function newFolder(data) {
    return { type: NEW_FOLDER, data }
}

export function updateProgress(data) {
    return { type: UPDATE_PROGRESS, data };
}

export function reqMenuInit(params) {
    return (dispatch, getState) => {
        const conf = new Config();
        const opt = conf.init('menu', getState);
        const req = new Request({ ...opt, ...params });
        // req.on('success', (res, status, xhr) => {
        //     dispatch(menuInit(res.data));
        // });
        req.on({
            before: (xhr) => { getProgress(dispatch, 'nl0'); },
            progress: (e, xhr) => { getProgress(dispatch, 'nl', e, xhr); },
            success: (res, status, xhr) => { dispatch(menuInit(res.data)); }
        });
        req.send();
    }
}

export function reqGetFiles(params) {
    return (dispatch, getState) => {
        const conf = new Config();
        const opt = conf.init('files', getState);
        const req = new Request({ ...opt, ...params });
        // req.on('success', (res, status, xhr) => {
        //     dispatch(getFiles(res.data));
        // });
        req.on({
            before: (e, xhr) => { getProgress(dispatch, 'nl0'); },
            progress: (e, xhr) => { getProgress(dispatch, 'nl', e, xhr); },
            success: (res, status, xhr) => { dispatch(getFiles(res.data)); }
        });
        req.send();
    }
}

export function reqNewFolder(params) {
    return (dispatch, getState) => {
        const conf = new Config();
        const opt = conf.init('newfolder', getState);
        const req = new Request({ ...opt, ...params });

        req.on({
            before: (e, xhr) => { getProgress(dispatch, 'nl0'); },
            progress: (e, xhr) => { getProgress(dispatch, 'nl', e, xhr); },
            success: (res, status, xhr) => { dispatch(menuInit(res.data)); }
        });
        req.send();
    }
}

export function reqDownloadFile(params) {
    // console.log(params);
    return (dispatch, getState) => {
        const conf = new Config();
        const opt = conf.init('download', getState);
        const req = new Request({ ...opt, dataType: 'blob', data: { id: params.data.id } });
        // req.on('success', (res, status, xhr) => {
        //     // console.log(res);
        //     // console.log(xhr.getAllResponseHeaders());
        //     // console.log(xhr.getResponseHeader('content-disposition'));

        //     let filename = 'Randy.NAS';
        //     const cd = xhr.getResponseHeader('content-disposition');
        //     if (cd.indexOf('filename=') > 0) {
        //         filename = decodeURI(cd.split('filename=')[1]);
        //     }

        //     const URL = window.URL || window.webkitURL;
        //     const blob = new Blob([res]);
        //     const url = URL.createObjectURL(blob);
        //     console.log(url);
        //     // const txt=document.createTextNode(filename);
        //     const a = document.createElement('a');
        //     a.style.display = 'none';
        //     a.download = filename;
        //     a.href = url;
        //     // a.appendChild(txt);
        //     document.body.appendChild(a);
        //     a.click();
        //     //sdocument.body.removeChild(a);
        // });

        req.on({
            before: (e, xhr) => { getProgress(dispatch, 'dl0', e, params); },
            progress: (e, xhr) => { getProgress(dispatch, 'dl1', e, params); },
            success: (res, status, xhr) => {
                let filename = 'Randy.NAS';
                const cd = xhr.getResponseHeader('content-disposition');
                if (cd.indexOf('filename=') > 0) {
                    filename = decodeURI(cd.split('filename=')[1]);
                }

                const URL = window.URL || window.webkitURL;
                const blob = new Blob([res]);
                const url = URL.createObjectURL(blob);
                // console.log('------blob-url--->', url);
                getProgress(dispatch, 'dl2', null, { data: { id: params.data.id, fname: filename, bloburl: url } });
            }
        });

        req.send();
    }
}

export function reqUploadFiles(params) {
    return (dispatch, getState) => {
        const conf = new Config();
        const opt = conf.init('upload', getState);
        const limit = conf.ul();
        for (let i = 0, len = params.files.length; i < len; i++) {
            const file = params.files[i], thisid = UUID(); //file.size,file.name,file.type
            const sp = Math.round(file.size / limit);
            // if (file.size > limit && sp > 1) {
            if (sp > 1) {
                for (let i = 0; i < sp; i++) {
                    let blob = null, percent = 0;
                    if (i < sp - 1) {
                        blob = file.slice(i * limit, (i + 1) * limit);
                        percent = Math.floor((limit / file.size) * 100);
                    }
                    else {  //last split
                        blob = file.slice(i * limit);
                        percent = 100 - (Math.floor((limit / file.size) * 100) * (sp - 1));
                    }
                    const req = new Request({ ...opt, data: { pid: params.pid, id: thisid, fname: file.name, fsize: file.size, ftype: file.type, files: blob, sp, order: i } });
                    req.on({
                        before: (e, xhr) => { getProgress(dispatch, 'ul0', e, { data: { id: thisid, fname: file.name, order: i, percent: percent } }); },
                        ulprogress: (e, xhr) => { getProgress(dispatch, 'ul1', e, { data: { id: thisid, order: i } }); },
                        success: (res, status, xhr) => {
                            console.log('-----success----->', res);
                            if (res.data.menu) dispatch(menuInit(res.data));
                        }
                    });
                    req.send();
                }
            }
            else {  //not split
                const req = new Request({ ...opt, data: { pid: params.pid, id: thisid, fname: file.name, fsize: file.size, ftype: file.type, files: file, sp: 1, order: 0 } });
                req.on({
                    before: (e, xhr) => { getProgress(dispatch, 'ul0', e, { data: { id: thisid, fname: file.name, order: 0, percent: 100 } }); },
                    ulprogress: (e, xhr) => { getProgress(dispatch, 'ul1', e, { data: { id: thisid, order: 0 } }); },
                    success: (res, status, xhr) => {
                        console.log('-----success----->', res);
                        dispatch(menuInit(res.data));
                    }
                });
                req.send();
            }

        }
    }
}

export function getProgress(dispatch, type, event, params) {
    switch (type) {
        case 'nl0':
            dispatch(
                updateProgress({
                    progress: { nl: { id: '', computable: false, loaded: 0, total: 0, progress: 0 } }
                })
            );
            break;
        case 'nl':
            dispatch(
                updateProgress({
                    progress: {
                        nl: {
                            id: '',
                            computable: event.lengthComputable,
                            loaded: event.loaded,
                            total: event.total,
                            progress: event.loaded > 0 ? Math.floor((event.loaded / event.total) * 10000) / 100 : 0
                        }
                    }
                })
            );
            break;
        case 'dl0':
            dispatch(
                updateProgress({
                    progress: {
                        dl: {
                            [params.data.id]: {
                                fn: params.data.fname,
                                bl: '',
                                ps: {
                                    0: { computable: false, loaded: 0, total: 0, percent: 100, progress: 0 }
                                }
                            }
                        }
                    }
                })
            );
            break;
        case 'dl1':
            dispatch(
                updateProgress({
                    progress: {
                        dl: {
                            [params.data.id]: {
                                // fn: event.data.fname,
                                // bl: '',
                                ps: {
                                    0: {
                                        computable: event.lengthComputable,
                                        loaded: event.loaded,
                                        total: event.total,
                                        progress: event.loaded > 0 ? Math.floor((event.loaded / event.total) * 10000) / 100 : 0
                                    }
                                }
                            }
                        }
                    }
                })
            );
            break;
        case 'dl2':
            dispatch(
                updateProgress({
                    progress: {
                        dl: {
                            [params.data.id]: {
                                fn: params.data.fname,
                                bl: params.data.bloburl
                            }
                        }
                    }
                })
            );
            break;

        case 'ul0':
            dispatch(
                updateProgress({
                    progress: {
                        ul: {
                            [params.data.id]: {
                                fn: params.data.fname,
                                ps: {
                                    [params.data.order]: {
                                        computable: false,
                                        loaded: 0,
                                        total: 0,
                                        progress: 0,
                                        percent: params.data.percent
                                    }
                                }
                            }
                        }
                    }
                })
            );
            break;
        case 'ul1':
            dispatch(
                updateProgress({
                    progress: {
                        ul: {
                            [params.data.id]: {
                                // fn: event.data.fname,
                                ps: {
                                    [params.data.order]: {
                                        computable: event.lengthComputable,
                                        loaded: event.loaded,
                                        total: event.total,
                                        progress: event.loaded > 0 ? Math.floor((event.loaded / event.total) * 10000) / 100 : 0
                                    }
                                }
                            }
                        }
                    }
                })
            );
            break;

        default:
            dispatch(
                updateProgress({
                    progress: { nl: { id: '', computable: false, loaded: 0, total: 0, progress: 0 } }
                })
            );
            break;
    }
}

export function initLogin(res) {
    return dispatch => {
        // if (!res.get('gu') && res.get('ut') === 'guest') {
        if (!res.gu && res.ut === 'guest') {
            dispatch(showMask());
            dispatch(showDialog());
            dispatch(showLogin());
        }
        else {
            dispatch(hiddenMask());
            dispatch(hiddenDialog());
            dispatch(hiddenLogin());
        }
    }
}

export function didLogin(res) {
    return dispatch => {
        // if (res.get('ud')) {
        if (res.ud) {
            dispatch(hiddenMask());
            dispatch(hiddenDialog());
            dispatch(hiddenLogin());
        }
    }
}