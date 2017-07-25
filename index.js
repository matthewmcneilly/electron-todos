const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({});
  mainWindow.loadURL(`file://${__dirname}/main.html`);

  // Build a menu used the template created below
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  // Set the menu using the one just built
  // Useful if more than one menu is used throughout the app
  Menu.setApplicationMenu(mainMenu);
});

// Menu template
const menuTemplate = [
  // {}, // Stops MacOSX from kidnapping the File menu and putting it under the application name instead
  {
    label: 'File',
    submenu: [
      { label: 'New Todo' },
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
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}
