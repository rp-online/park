Die Section-Nav übernimmt zwei Rollen:
 
### Headline und Deeplinks

Zum einen betitelt Sie auf Übersichtsseiten [Section](#section)-Komponenten, und stellt eine Reihe Deeplinks in ihre Unterbereiche dar. Siehe Variante `default`, zu sehen auf der [Startseite](./).

Die Deeplinks werden in der Eigenschaft `navigation` konfiguriert.

Eine Deeplink-Eintrag kann auch ein gesponsorter Advertorial-/Werbeeintrag sein, was per boolscher Eigenschaft `isAd` markiert wird.
 
### Headline und Breadcrumb, plus ggf. Deeplinks

Zum anderen kann Sie auf Übersichtsseiten, die nicht die Startseite sind, an Stelle der [Quick-Nav](#quick-nav) als Kombinierte Breadcrumb + Navigation in die Unterbereiche genutzt werden. In dieser Form kann Sie auf jeder Übersichtsseite nur einmal vorkommen. Siehe Varianten `breadcrumb` und `max`, zu sehen auf der [Startseite](./).

 Die `headline` beinhaltet die suchmaschinenrelevante SEO-Zeile, während `breadcrumb` die eigentlichen Breadcrumb-Zwischenschritte dorthin abbildet.

Manchmal kann es nötig sein, dass bestimmte Einträge zwar da sein müssen, aber nicht auftauchen sollen. In diesem Fall kann ein Navigationseintrag die boolsche Eigenschaft `isHidden` mit dem Wert `true` tragen.