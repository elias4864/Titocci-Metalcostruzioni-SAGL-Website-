

# Rebuild of Titocci Metalcostruzioni SAGL - Website

Offizielle Website für den Schweizer Metallbau- und Schlosserbetrieb Titocci Metalcostruzioni SAGL (titocci.ch) möglichst genau rebuilded. Das Projekt verwendet ein modernes Frontend-Setup basierend auf React 19 und Vite, gekapselt in einer Docker-Umgebung(Docker-Compose) für konsistente Deployments sowie automatisiert über GitHub Actions für moderne DevOps-Praktiken(CI/CD)

---

## 🚀 Technologie-Stack

- **Frontend:** React (v19), React Router DOM(19.3.1), React-Intersection-observer(9.5.3)  und  react-countup(6.5.3)
- **UI & Animationen:** React CountUp, React Intersection Observer,
- - **UI Component Library:** Material UI (`@mui/lab`, `@mui/material`)
- **Build-Tool:** Vite (v8) und Npm
- **Styling:** CSS3,Emotion (`@emotion/react`, `@emotion/styled`) (Responsive Design, Custom Properties)
- **Deployment:** Docker und Docker-Compose Node.js Runtime
- **Orchestrierung:**  Docker Container
-  **Automatisierung:**  GitHub Actions(Github Worfklow-Pipeline)




Die Website  umfasst folgende Routes+Pages

- **`/` bzw. `/home`**: Hauptstartseite(Übersicht+Dienstleistungen)
- **`/chi-siamo`**: Über das Unternehmen(*Über Uns Page)
- **`/servizi`**: Detaillierte Übersicht aller Dienstleistungen (*Progettazione, Costruzione, Montaggio, Assistenza*)
- **`/kontakte`**: Kontaktinformationen, Anfahrtskarte & Kontaktformular über Titocci Metalconstruzione SAGL
- **`/impressum`**: Impressum nach DSGVO
- **`/galeria`**: Galerie 
- **`/privacy`**: Datenschutzbestimmungen (Privacy Policy) gemäss DSG+DSGVO


---



## 📋 Vorinstallationen 
Vor dem lokalen Deployment  müssen folgende Tools  bereits installiert sein:

-Node.js (Version 20 LTS empfohlen)

-Git

-Docker Compose Depdendencies installiert
-Docker Desktop
-Docker
-Npm installiert

## ⚙️ Lokale Installation & Entwicklung

Stelle sicher, dass **Node.js** auf deinem Node-Server installiert ist. Führe die folgenden Befehle im Terminal im Stammverzeichnis(Titocci-Metalcostruzioni-SAGL-Website-\my-react-app\Titocci-Metalcostruzioni-SAGL-Website->) des Vite-Projekts aus:

###  Bei jedem Deployment Dependencies removen und neu  installieren 

 ## Repository aus Github clonen auf Desktop
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


🔄 ### CI/CD Pipeline (GitHub Workflows)
Das Repository ist mit einer GitHub Actions Pipeline ausgestattet (.github/workflows/deploy.yml). Bei jedem Push oder Pull Request auf den main-Branch führt die Pipeline folgende Schritte aus:

Checkout Code: Lädt den aktuellen Repository-Stand.

Setup Node.js Environment: Richtet die Node-Umgebung ein und cached npm-Pakete.

Dependencies & Linting: Installiert die Pakete sauber über npm ci.

Vite Production Build: Testet den Build-Prozess (npm run build) auf Syntax- und CSS-Fehler.

Docker Build & Push: Baut das Docker-Image und stellt es auf dem Zielserver / der Container Registry(pullt es )  bereit.








   
