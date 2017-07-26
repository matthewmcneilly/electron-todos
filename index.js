const electron = require('electron');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);
  // When main window closed quit the entire app and all of its child processes
  mainWindow.on('closed', () => app.quit());

  // Build a menu used the template created below
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  // Set the menu using the one just built
  // Useful if more than one menu is used throughout the app
  Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title: 'Add New Todo'
  });
  addWindow.loadURL(`file://${__dirname}/add.html`);
  // allows the BrowserWindow to be garbage collected by JavaScript
  // so BrowserWindow is reassigned by this functions runs as BrowserWindow-v2
  addWindow.on('closed', () => addWindow = null);
}

ipcMain.on('todo:add', (event, todo) => {
  mainWindow.webContents.send('todo:add', todo);
  addWindow.close();
  // addWindow = null;
});

// Menu template
const menuTemplate = [
  // {},
  {
    label: 'File',
    submenu: [
      {
        label: 'New Todo',
        click() { createAddWindow() }
      },
      {
        label: 'Quit',
        // immediately invoked function
        // ternary expression
        accelerator: process.platform  === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        // Example of the full function
        /*accelerator: (() => {
          if (process.platform === 'darwin') {
            return 'Command+Q';
          } else {
            return 'Ctrl+Q';
          }
        })(),*/
        click() {
          app.quit();
        }
      }
    ]
  }
];

// If platform is macosx given it an empty object ahead of the menuTemplate
// Stops MacOSX from kidnapping the File menu and putting it under the application name
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

// If not in production environment show developer tools for the current focused window
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'Developer',
    submenu: [
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}
