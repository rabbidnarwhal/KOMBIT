# KOMBIT

#### Popover delay when dismiss bug
Fixed by changing delay on:
```
node_modules/ionic-angular/components/popover/popover-transitions.js
```
Manually change it or run this script on terminal to fix it:
```
sed -i 's/500/100/g' node_modules/ionic-angular/components/popover/popover-transitions.js
```