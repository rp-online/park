Diese Komponente bildet die Hauptnavigation der Seite und manifestiert sich in einem soegannten Offcanvas-Menü.

Aus Performance- und SEO-Gründen wird die Navigation serverseitig zunächst nur sehr kompakt für den aktuell aktiven Bereich bestückt. Anschließend wird leicht verzögert der gesamte Menübaum per AJAX geholt und das Menü gegen eines in voller Länge getauscht.

Dies geschieht über eines unserer clientseitigen Widgets (also unserer Mechanik, Twig-Templates im Browser zu rendern). 