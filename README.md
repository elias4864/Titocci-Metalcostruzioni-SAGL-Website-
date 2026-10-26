

# Rebuild of Titocci Metalcostruzioni SAGL - Website

Offizielle Website für den Schweizer Metallbau- und Schlosserbetrieb Titocci Metalcostruzioni SAGL (titocci.ch) möglichst genau rebuilded. Das Projekt verwendet ein modernes Frontend-Setup basierend auf React 19 und Vite, gekapselt in einer Docker-Umgebung(Docker-Compose) für konsistente Deployments sowie automatisiert über GitHub Actions für   DevOps-Praktiken(CI/CD)

---

## 🚀 Technologie-Stack

- **Frontend:** React (v19), React Router DOM(19.3.1), React-Intersection-observer(9.5.3)  und  react-countup(6.5.3)
- **UI & Animationen:** React CountUp, React Intersection Observer,
- - **UI Component Library:** Material UI (`@mui/lab`, `@mui/material`)
- **Build-Tool:** Vite (v8) und Npm
- **Styling:** CSS3,Emotion (`@emotion/react`, `@emotion/styled`) (Responsive Design, Custom Properties)
- **Deployment:** Docker und Docker-Compose Node.js Runtime
-  **Automatisierung:**  GitHub Actions(Github Worfklow-Pipeline)




Die Website  umfasst folgende Routes+Pages

- **`/` bzw. `/home`**: Hauptstartseite(Übersicht+Dienstleistungen)
- **`/chi-siamo`**: Über das Unternehmen
- **`/servizi`**: Detaillierte Übersicht aller Dienstleistungen (*Progettazione, Costruzione, Montaggio, Assistenza*)
- **`/kontakte`**: Kontaktinformationen, Anfahrtskarte & Kontaktformular
- **`/impressum`**: Impressum nach DSGVO 
- **`/privacy`**: Datenschutzbestimmungen (Privacy Policy) gemäss DSG+DSGVO


---

## ⚙️ Lokale Installation & Entwicklung

Stelle sicher, dass **Node.js** auf deinem System installiert ist. Führe die folgenden Befehle im Terminal im Stammverzeichnis(Titocci-Metalcostruzioni-SAGL-Website-\my-react-app\Titocci-Metalcostruzioni-SAGL-Website->) des Projekts aus:

### 1. Bei jedem Deployment Dependencies removen und neu  installieren 
# Ins Root Directory wechseln des Vite-Projekts wechseln /Titocci-Metalconstruzioni-SAGL
1. cd my-react-app und danach cd Titocci-Metalcostruzioni-SAGL-Website
 # Alte Abhängigkeiten/Lock-Dateien bereinigen (optional, falls erforderlich) und Node-Directory removen
2. rm -rf node_modules package-lock.json
 # Neue Dependencies des package.json neu installieren mit node_modules Ordner und Cache  jedesmal neu leeren 
3. npm install
 #  Entwicklungsserver) NPM-Viteserver lokal  PC deployen  auf Default Port 5173 oder wenn besetzt anderer Port redirected
4. npm run dev (Option A)
# Über Docker Compose per Container (Option B) deployen

5. docker compose up -d
# Überprüfen ob Viteserver in Browser auf Port  http://localhost:5173 verfügbar ist oder alternative redirected wird auf anderer Port http://localhost: 5174

🐳 Docker & CI/CD Deployment

# Das Projekt nutzt einen GitHub Actions Workflow, um Docker-Images automatisiert zu erstellen und bereitzustellen.

#  Docker-Build(Image bauen)  lokal  im Rootdirectory(/Titocci-Metalconstruzioni-SAGL-Website) ausführen

6. docker build -t titocci-website:latest .

   
