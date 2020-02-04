Die Quick-Nav-Komponente stellt einen Schnellzugriff für Städte- und Sportverein-Indexseiten dar. Eingeloggte Benutzer können auf ihrem Einstellungen-Bildschirm festlegen, welche Städte und Sportvereine sie gerne im Schnellzugriff angezeigt habne wollen.

Zu diesem Zweck fragt die Komponente die entsprechenden Methoden der globalen User-API an:

```
window.park.user.getPreferredCities();
```

und 

```
window.park.user.getPreferredSportsclubs();
```