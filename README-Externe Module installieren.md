## Externe Module nachinstallieren & nutzen

Alle Module die bei NPM zu finden sind können auch in Yarn genutzt werden

    yarn install EXTENSION
    
### Modul einbinden

    opt/InterRed/gera/data/webserver/global/php_includes/templates/src/widgets/vendor.js
    
    Zeile 3ff: 
    import {INTERNERNAME} from 'EXTENSION';
    import {lory} from 'lory.js';
    
    Am Ende
    window.INTERNERNAME = INTERNERNAME;
    window.lory = lory;
    
### Gulp bauen

    gulp widgets