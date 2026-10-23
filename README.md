

# Titocci Metalcostruzioni SAGL - Website

Offizielle Website für den Schweizer Metallbau- und Schlosserbetrieb Titocci Metalcostruzioni SAGL (titocci.ch) möglichst genau rebuilded. Das Projekt verwendet ein modernes Frontend-Setup basierend auf React 19 und Vite, gekapselt in einer Docker-Umgebung für konsistente Deployments sowie automatisiert über GitHub Actions für  DevOps-Praktiken.

---

## 🚀 Technologie-Stack

- **Frontend:** React (v19), React Router DOM(19.3.1), React-Intersection-observer(9.5.3)  und  react-countup(6.5.3)
- **UI & Animationen:** React CountUp, React Intersection Observer
- **Build-Tool:** Vite (v8) und Npm
- **Styling:** CSS3 (Responsive Design, Custom Properties)
- **Deployment:** Docker und Docker-Compose Node.js Runtime
-  **Automatisierung:**  GitHub Actions(CI/CD) 


---

## ⚙️ Lokale Installation & Entwicklung

Stelle sicher, dass **Node.js** auf deinem System installiert ist. Führe die folgenden Befehle im Terminal im Stammverzeichnis(Titocci-Metalcostruzioni-SAGL-Website-\my-react-app\Titocci-Metalcostruzioni-SAGL-Website->) des Projekts aus:

### 1. Bei jedem Deployment Dependencies removen und neu  installieren 
# Ins Root Directory wechseln des Vite-Projekts wechseln
1. cd my-react-app und danach cd Titocci-Metalcostruzioni-SAGL-Website
2. # Alte Abhängigkeiten/Lock-Dateien bereinigen (optional, falls erforderlich) und Node-Directory removen
rm -rf node_modules package-lock.json
3. # Neue Dependencies des package.json neu installieren mit node_modules Ordner
4. npm install
5. # NPM-Viteserver lokal  PC deployen  auf Default Port 5173
6. npm run dev (Option A)
7.Über Docker Compose automatisiert(Option B)

# Docker-Container im Hintergrund starten
docker compose up -d
8. Überprüfen ob Viteserver in Browser auf Port  http://localhost:5173 verfügbar ist

🐳 Docker & CI/CD Deployment

Das Projekt nutzt einen GitHub Actions Workflow, um Docker-Images automatisiert zu erstellen und bereitzustellen.

Docker-Build lokal ausführen

docker build -t titocci-website:latest .

   
