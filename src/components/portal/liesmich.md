Die Portal-Komponente ist die Primitive für Werbeeinbindungen. Der Name "Portal" rührt daher, dass Adblocker diesen Begriff nicht vom Fleck weg herausfiltern. Und es handelt sich ja meist um ein Portal in eine andere Welt. Eine oft sehr schlecht programmierte.

Die Eigenschaften teilen sich in einen Block für `mobile` und einen Block für `desktop`. Je nachdem auf was für einem Gerät man den Werbeplatz ausgespielt bekommt, kommt entweder der eine oder der andere Teil zum Tragen.

Jeder der beiden Teile besteht aus folgenden Eigenschaften:

* `type`: Die offizielle Bezeichnung des Werbeformats. Dient dazu, den entsprechenden Platz von vorneherein vorzusehen. Welche Typen unterstützt werden steht weiter unten. Obwohl es am einfachsten wäre, immer das Format "free" anzugeben, ist es für eine gute User Experience hilfreich, etwas präziser zu werden.
* `html`: Freies HTML, das ausgeführt werden muss, um das Werbemittel anzuzeigen.
* `lazy`: Ist dieser boolsche Wert auf `true` gesetzt, dann wird das HTML dieser Werbung erst dann ausgeführt, wenn der Werbeplatz in den Viewport scrollt.

### Unterstützte Werbeformate

* free: beliebige Größe
* layer: beliebige Größe
* interstitial: beliebige Größe

* medium-rectangle: 300 x 250
* large-rectangle: 336 x 280
* halfpage: 300 x 600
* skyscraper: 120 x 600
* wide-skyscraper: 160 x 600 
* dynamic-sidebar: 300 x 600 
* banner: 428 x 60
* superbanner: 728 x 90
* leaderboard: 728 x 90
* billboard: 800 x 250

* mobile-leaderboard: 320 x 50
* mobile-banner: 320 x 50
* large-mobile-banner: 320 x 100
* mobile-rectangle: 320 x 250


