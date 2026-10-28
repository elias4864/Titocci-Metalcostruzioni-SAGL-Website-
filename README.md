

# Rebuild of Titocci Metalcostruzioni SAGL - Website

Offizielle Website für den Schweizer Metallbau- und Schlosserbetrieb Titocci Metalcostruzioni SAGL (titocci.ch) möglichst genau nachgebaut. Das Vite-Projekt verwendet ein modernes Frontend-Setup basierend auf React 19 und Vite, gekapselt in einer Docker-Umgebung(Docker-Compose) für konsistente Deployments sowie automatisiert über GitHub Actions für moderne DevOps-Praktiken(CI/CD)

---

## 🚀 Technologie-Stack

- **Frontend:** React (v19), React Router DOM(19.3.1), React-Intersection-observer(9.5.3)  und  react-countup(6.5.3)
- **UI & Animationen:** React CountUp, React Intersection Observer,
- - **UI Component Library:** Material UI (`@mui/lab`, `@mui/material`)
- **Build-Tool:** Vite (v8) und Npm-Libaries
- **Styling:** CSS3,Emotion (`@emotion/react`, `@emotion/styled`) (Responsive Design, Custom Properties)
- **Deployment:** Docker und Docker-Compose Node.js Runtime
- **Orchestrierung:**  Docker Container(Docker Swarm)
-  **Automatisierung:**  GitHub Actions(Github Worfklow-Pipeline)




Diese Website  umfasst folgende Routes+Seitenlinks in der Navbar

- **`/` bzw. `/home`**: Hauptstartseite(Übersicht+Dienstleistungen)
- **`/chi-siamo`**: Über das Unternehmen(*Über Uns Page)
- **`/servizi`**: Detaillierte Übersicht aller Dienstleistungen (*Progettazione, Costruzione, Montaggio, Assistenza*)
- **`/kontakte`**: Kontaktinformationen, Anfahrtskarte & Kontaktformular über Titocci Metalconstruzione SAGL
- **`/impressum`**: Impressum nach DSGVO+DSG
- **`/galeria`**: Galerie-Karte
- 
- **`/privacy`**: Datenschutzbestimmungen (Privacy Policy) gemäss DSG+DSGVO


---


## 🧪 Tests & Qualitätssicherung (Vitest / React Testing Library)

Für die wichtigsten UI-Komponenten wie Home, Kontakt, sowie Chi Siamo  sind automatisierte Unit- und Integrationstests eingerichtet, welche Komponenten-Rendering, State-Wechsel, Texte von Buttons, Textelemente sowie das serverseitige Rendering  test mit Mocking-Objekten.

### Test-Struktur:
- **`Home.test.jsx`**: Testet das Header-Rendering, Heading-Validierungen, das interaktive Bild-Karussell (Vor/Zurück-Buttons sowie automatisches Autoplay nach 3 Sekunden), Leistungs-Sektionen und `StatCard`-Komponenten.
- **`Chi Siamo.test.jsx`**: Testet das Rendering der "Über uns"-Seite, Navigationselemente sowie die Existenz relevanter Inhaltsstrukturen.
-  **`Kontakt.test.jsx`**: Testet das Kontaktformular mit der "Contact"-Seite, dem Submit-Button sowie die benötigten Input-Felder.

### 🚀 Vor jedem (Jest)Tests  lokal ausführen:

Führe die folgenden Befehle im Stammverzeichnis deines Vite-Projekts aus (`my-react-app/Titocci-Metalcostruzioni-SAGL-Website`):

 **Abhängigkeiten installieren** (falls noch nicht geschehen):
1. npm install --legacy-peer-deps oder npm install
2. npm install --save-dev @testing-library/react @testing-library/dom(DevDependencies Libaries installieren)
Um die Tests in deiner Entwicklungsumgebung auszuführen, nutze folgenden Befehl im  Rootprojektverzeichnis(my-react-app/Titocci-Metalconstruzioni-SAGL-Website-)
 Tests ausführen mit Live-Reloading der Unit-Tests
3. npm run test(Vite) oder  npx vitest run(Vitest)
4. Bei den package.json jeweils unter "scripts" folgenden Eintrag  hinzufügen:
   test vitest oder alternativ



## 📋 Vorinstallationen 
Vor dem lokalen Deployment  müssen folgende Tools  bereits installiert sein:

-Node.js (Version 20 LTS empfohlen)

-Git
-CMD/Powershell(Git Bash CLI für Deployment Vitserver

-Docker Compose Depdendencies installiert
-Docker Desktop
-Docker
-Npm Libaries und Packages bereits installiert 

## ⚙️ Lokale Installation & Entwicklung

Stelle sicher, dass **Node.js** auf deinem Node-Server installiert ist. Führe die folgenden Befehle im Terminal im Stammverzeichnis(Titocci-Metalcostruzioni-SAGL-Website-\my-react-app\Titocci-Metalcostruzioni-SAGL-Website->) des Vite-Projekts aus:

###  Bei jedem Deployment Dependencies removen und neu  installieren 

 ## Repository aus Github in eigenen Ordner clonen auf Desktop
1. git  clone https://github.com/elias4864/Titocci-Metalcostruzioni-SAGL-Website-.git

# Ins Root Directory wechseln des Vite-Projekts wechseln /Titocci-Metalconstruzioni-SAGL
2. cd my-react-app und danach cd Titocci-Metalcostruzioni-SAGL-Website
 # Alte Abhängigkeiten/Lock-Dateien bereinigen (optional, falls erforderlich) und Node-Directory removen
3. rm -rf node_modules package-lock.json
 # Neue Dependencies des package.json neu installieren mit node_modules Ordner und Cache  jedesmal neu leeren 
4. npm install
 #  Entwicklungsserver) NPM-Viteserver lokal  PC deployen  auf Default Port 5173 oder wenn besetzt anderer Port redirected
5. npm run dev (Option A)
# Über Docker Compose per Container (Option B) deployen

6. docker compose up -d
# Überprüfen ob Viteserver in Browser auf Port  http://localhost:5173 verfügbar ist oder alternativ auf einen andereern freien Port sofort  redirected wird wie beispielsweise  http://localhost: 5174

🐳 Docker & CI/CD Deployment

# Das Projekt nutzt einen GitHub Actions Workflow, um Docker-Images automatisiert zu erstellen und bereitzustellen.

#  Docker-Build(Image bauen)  lokal  im Rootdirectory(/Titocci-Metalconstruzioni-SAGL-Website) ausführen

7. docker compose up -d --build -t titocci-website:latest .


🔄 ### CI/CD  Deployment Viteserver- Pipeline (GitHub Workflows)
Das Repository ist mit einer GitHub Actions Pipeline ausgestattet (.github/workflows/deploy.yml). Bei jedem Push oder Pull Request auf den main-Branch führt die Pipeline folgende Schritte aus:

Checkout Code: Lädt den aktuellen Repository-Stand.

Setup Node.js Environment: Richtet die Node-Umgebung ein und cached npm-Pakete.

Dependencies & Linting: Installiert die Npm-Dependencies sauber über npm ci.

Vite Production Build: Testet den Build-Prozess (npm run build) auf Syntax- und CSS-Fehler.

Docker Build & Push: Baut das Docker-Image und stellt es auf dem Zielserver / der Container Registry(/Pull )  bereit

🚀 ###  CI/CD Pipeline für  automatisierte Deloyment der Github Page: 
1GitHub Pages DeploymentDieses Repository nutzt einen automatisierten GitHub Actions Workflow (deploy.yml). 
2.Bei jedem Push auf den main  und Master-Branch wird die React-Anwendung (Vite) automatisch gebaut, ein Deployment-Artefakt erstellt und auf GitHub Pages veröffentlicht.

⚙️ Konfiguration & Steuerung Trigger: Die Pipeline startet automatisch, sobald neuer Code in den main-Branch gepusht wird.Berechtigungen (permissions):contents: read: Erlaubt das Auslesen des Quellcodes.pages: write: Erlaubt das Veröffentlichen auf GitHub Pages.id-token: write: Erzeugt ein OIDC-Token zur sicheren Authentifizierung gegenüber GitHub Pages.Ressourcen-Steuerung (concurrency): Verhindert Konflikte bei mehreren schnellen Pushes. Wenn ein neuer Run startet, wird ein noch laufendes altes Deployment abgebrochen (cancel-in-progress: true).
🛠️ Ablauf der Build- & Deploy-Schritte (steps)SchrittBefehl / Action Anleitung
1. Checkout Repositoryactions/checkout@v4lädt den aktuellen Quellcode aus dem Repository auf den virtuellen ubuntu-latest-Runner herunter
2. Node.js einrichten: actions/setup-node@v4Installiert Node.js in Version 20 und aktiviert den automatischen npm-Paket-Cache für schnellere Builds.
3. Dependencies jedesmal Npm-Packete neu installieren und removen:
4.  npm ci --legacy-peer-deps Führt eine saubere Neuinstallation der npm-Pakete durch.Das Flag --legacy-peer-deps löst Versionskonflikte zwischen Vite 8 und älteren Peers.
 4.npm run build Projekt neu bauen ( Docker Build)Führt das Vite-Build-Skript aus. Compiliert JSX/JS, optimiert Assets und generiert die produktionsbereiten Dateien im /dist-Ordner.
6.  5. Build-Artefakt hochladen actions/upload-pages-artifact@v3Verpackt den Inhalt des generierten ./dist-Ordners als komprimiertes GitHub-Pages-Artefakt.

9. actions/deploy-pages@v4 nimmt das hochgeladene Artefakt und veröffentlicht es live unter der GitHub Pages URL direkt(Github Deploy with a Branch auf dem  /dev Branch direkt)

Methode 1: GitHub Pages über GitHub Actions aktivieren (Empfohlen)
Da dein Workflow (.github/workflows/deploy.yml) die Artefakte baut und über actions/deploy-pages@v4 hochlädt, musst du GitHub Pages in den Repository-Einstellungen auf Actions umstellen:

Navigiere auf GitHub zu deinem Repository: [https://github.com/elias4864/Titocci-Metalcostruzioni-SAGL-Website-](https://github.com/elias4864/Titocci-Metalcostruzioni-SAGL-Website-)

In den Settings: 
1. Wähle in der linken Seitenleiste Pages aus.

2. Stelle unter Build and deployment den Punkt Source auf GitHub Actions um (statt Deploy from a branch).

Sobald der nächste Push auf den main-Branch erfolgt, veröffentlicht die Pipeline deine Website automatisch unter:[https://elias4864.github.io/Titocci-Metalcostruzioni-SAGL-Website-/](https://elias4864.github.io/Titocci-Metalcostruzioni-SAGL-Website-/)

Methode 2: Manuelles Deployment über das gh-pages Paket (Lokal)
Falls du das Deployment einmal manuell vom Terminal aus durchführen möchtest:

3. gh-pages Paket installieren und ignoriert dabei alle Npm- Peer- Dependencies-Konflikte




4.npm install gh-pages --save-dev --legacy-peer-deps
In der package.json überprüfen, ob die Skripte hinterlegt sind:


5. Im Package.json füge den Eintrag /homepage  hinzu :

"homepage": "https://elias4864.github.io/Titocci-Metalcostruzioni-SAGL-Website-",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

6. Füge im package.json   unter dem Scripts-Tag folgende Einträge fürs Github Pages-Hosting hinzu:

 7.  scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
   
8. Füge im vite.config.js folgenden Eintrag am Ende hinzu:
    base: '/Titocci-Metalcostruzioni-SAGL-Website-/' //Name des exakten Github Repositories mit Base-Url hinzufügen
  
9. Lade das Disk Directory herunter fürs Deployment der Github Page:
    npm run deploy






   
