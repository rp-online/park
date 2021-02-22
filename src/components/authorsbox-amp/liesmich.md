Diese Komponente stellt die Autorenbox im Artikel dar. Weil ihre Mechanik ein wenig komplizierter ist, wurde sie in eine eigene Komponente ausgelagert. Im einfachsten Fall arbeitet sie ausschließlich mit der `text`-Eigenschaft und gibt diese aus (zu sehen in der Ausprägung "no-authors-array").

Dieser Text soll vollkommen frei von der Redaktion bestückt werden können.

Da es aber auch den Wunsch gab, Autoren eines Artikels besser zu präsentieren, ist die Komponente in der Lage, den Text nach Autorennamen abzusuchen, die sie als Array in der `authors`-Eigenschaft übergeben bekommt. Dabei sucht Sie nicht nur nach dem vollen Namen, sondern sie sucht den Text zusätzlich nach dem Autorennamen mit abgekürzten Vornamen ab. Sie würde also gleichermaßen nach "Mara Mustermann", wie auch nach "M. Mustermann" suchen. Wird eine Autorin/ein Autor auf die Art gefunden, wird er/sie ähnlich einer Tab-Navigation anklickbar. Zusätzlich wird aus den weiteren Autoreninfos eine Autorenbox unterhalb des Textes generiert, die bei Klick auf den Autorennamen angezeigt wird.

Die Komponente ist zudem auch darauf vorbereitet, dass Autoren ggf. auch einmal über kein Profilbild verfügen - z.B. wenn es sich um Gastautoren handelt.

