Das Popover Component dient als Tooltip/Popover Wrapper für Widgets. Es benutzt `popper.js`

Das Popover kann an ein Element gebunden werden und mit folgenden Attributen konfiguriert werden:

`data-popover="promo-layer"` wird benötigt. `"promo-layer"` wäre hier das gewünschte Widget.

`data-popover-data="{{ data|json_encode|escape('html_attr') }}"` wird benötigt. Hier werden die benötigten Daten die das Widget rendern soll übergeben.

`data-popover-padding="10"` optional. Setzt den Abstand zum Popover Container. `default -> 0`

`data-popover-position="top-end"` optional. Stellt die priorisierte Position des Popover ein. `default -> "bottom"` Siehe `popper.js` Positionen.

`data-popover-close-button` optional. Wenn gesetzt wird ein Schließen Button gerendert. `default -> false`

`data-popover-close-color="dark"` optional. Stellt schwarzen oder weißen Close Button ein. `default -> light`

`data-popover-arrow` optional. Wenn gesetzt wird ein Pfeil zwischen dem Popover und dem Referenzelement gerendert. `default -> false`

`data-popover-arrow-vignette` optional. Legt eine leichte Vignette auf den Hintergrund des Widget-Inhalts, welche auf der Seite des Pfeils ist. Hier auf den `promo-layer`. Farbe ist die selbe wie vom Pfeil. 

`data-popover-arrow-color="blue"` optional. Setzt die Farbe des Pfeils und der Vignette. `default -> #333`

Das Popover öffnet sich mit mouseover. Das Verhalten kann überschrieben werden mit `data-popover-open-events="click"`.
     
     
     
     
     
 
     