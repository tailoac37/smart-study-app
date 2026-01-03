const { app, BrowserWindow, ipcMain, Notification, Menu } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
    const newWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
        icon: path.join(__dirname, '../public/icon.png'),
        title: 'Smart Study App - Quản Lý Học Tập Thông Minh',
        backgroundColor: '#f8fafc',
        show: false,
    });

    // Load app
    const isDev = process.argv.includes('--dev');

    if (isDev) {
        newWindow.loadURL('http://localhost:5173');
        newWindow.webContents.openDevTools();
    } else {
        newWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }

    newWindow.once('ready-to-show', () => {
        newWindow.show();
    });

    // Store first window as mainWindow
    if (!mainWindow) {
        mainWindow = newWindow;
        mainWindow.on('closed', () => {
            mainWindow = null;
        });
    }

    return newWindow;
}

function createMenu() {
    const template = [
        {
            label: 'File',
            submenu: [
                {
                    label: 'Cửa sổ mới',
                    accelerator: 'CmdOrCtrl+N',
                    click: () => {
                        createWindow();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Thoát',
                    accelerator: 'CmdOrCtrl+Q',
                    click: () => {
                        app.quit();
                    }
                }
            ]
        },
        {
            label: 'View',
            submenu: [
                { role: 'reload', label: 'Tải lại' },
                { role: 'forceReload', label: 'Tải lại (Bỏ cache)' },
                { role: 'toggleDevTools', label: 'DevTools' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Khôi phục zoom' },
                { role: 'zoomIn', label: 'Phóng to' },
                { role: 'zoomOut', label: 'Thu nhỏ' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Toàn màn hình' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize', label: 'Thu nhỏ' },
                { role: 'close', label: 'Đóng' }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

// App lifecycle
app.whenReady().then(() => {
    createMenu(); // Create application menu
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// IPC Handlers
ipcMain.handle('show-notification', (event, { title, body }) => {
    if (Notification.isSupported()) {
        new Notification({
            title,
            body,
            icon: path.join(__dirname, '../public/icon.png'),
        }).show();
    }
});

ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});

console.log('Electron app started successfully!');
