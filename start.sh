#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🏠 AI CHORE MANAGER - START SCRIPT                                      ║
# ║                                                                           ║
# ║   This script sets up and launches the AI Chore Manager application.      ║
# ║   It automatically installs all dependencies and starts the services.     ║
# ║                                                                           ║
# ║   Features:                                                               ║
# ║   • 🍺 Installs Homebrew if missing                                       ║
# ║   • 📦 Installs pnpm package manager                                      ║
# ║   • 🦙 Sets up Ollama for local AI                                        ║
# ║   • 🗄️  Configures SQLite database                                        ║
# ║   • 🚀 Launches the Next.js development server                            ║
# ║                                                                           ║
# ║   Usage: ./start.sh                                                       ║
# ║                                                                           ║
# ║   Author: Samy DJEMILI                                                    ║
# ║   Project: #9/365 - Year Coding Challenge                                 ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e # 🛑 Exit immediately if any command fails

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎨 COLORS & FORMATTING                                                    │
# │ Define ANSI escape codes for colorful terminal output                     │
# └───────────────────────────────────────────────────────────────────────────┘
RED='\033[0;31m'    # ❌ Errors
GREEN='\033[0;32m'  # ✅ Success messages
YELLOW='\033[1;33m' # ⚠️  Warnings & installations
BLUE='\033[0;34m'   # 📘 Info messages
PURPLE='\033[0;35m' # 💜 Accent color (matches app theme)
CYAN='\033[0;36m'   # 🔵 Highlights
BOLD='\033[1m'      # 💪 Bold text
NC='\033[0m'        # 🔄 Reset (No Color)

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 📂 DIRECTORY SETUP                                                        │
# │ Navigate to the script's directory for consistent execution               │
# └───────────────────────────────────────────────────────────────────────────┘
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🎬 WELCOME BANNER                                                         │
# │ Display a beautiful ASCII art header                                      │
# └───────────────────────────────────────────────────────────────────────────┘
echo ""
echo -e "${PURPLE}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║${NC}                                                           ${PURPLE}║${NC}"
echo -e "${PURPLE}║${NC}   🏠  ${BOLD}${CYAN}AI CHORE MANAGER${NC}                                   ${PURPLE}║${NC}"
echo -e "${PURPLE}║${NC}                                                           ${PURPLE}║${NC}"
echo -e "${PURPLE}║${NC}   ${BOLD}Smart household management with AI assistance${NC}          ${PURPLE}║${NC}"
echo -e "${PURPLE}║${NC}                                                           ${PURPLE}║${NC}"
echo -e "${PURPLE}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🔧 UTILITY FUNCTIONS                                                      │
# │ Helper functions for common operations                                    │
# └───────────────────────────────────────────────────────────────────────────┘

# 🔍 Check if a command exists in PATH
command_exists() {
  command -v "$1" &>/dev/null
}

# ✅ Print a success message with checkmark
print_success() {
  echo -e "${GREEN}   ✅ $1${NC}"
}

# ⚠️  Print a warning/info message
print_warning() {
  echo -e "${YELLOW}   ⚠️  $1${NC}"
}

# 📘 Print an info message
print_info() {
  echo -e "${BLUE}   📘 $1${NC}"
}

# 🔄 Print a step header
print_step() {
  echo ""
  echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${BOLD}   $1${NC}"
  echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📦 DEPENDENCY CHECKS & INSTALLATION                                     ║
# ║                                                                           ║
# ║   The following section verifies all required tools are installed:        ║
# ║   • Homebrew (macOS package manager)                                      ║
# ║   • pnpm (fast, disk-efficient package manager)                           ║
# ║   • Node.js (JavaScript runtime)                                          ║
# ║   • Ollama (local LLM runner)                                             ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🔍 Checking Dependencies"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🍺 HOMEBREW CHECK                                                         │
# │ Homebrew is the package manager for macOS, needed to install other tools  │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists brew; then
  print_warning "Homebrew not found. Installing... 🍺"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

  # 🍎 Add Homebrew to PATH for Apple Silicon Macs (M1/M2/M3)
  if [[ -f "/opt/homebrew/bin/brew" ]]; then
    eval "$(/opt/homebrew/bin/brew shellenv)"
  fi
else
  print_success "Homebrew is installed 🍺"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 📦 PNPM CHECK                                                             │
# │ pnpm is a fast, disk space efficient package manager for Node.js          │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists pnpm; then
  print_warning "pnpm not found. Installing via Homebrew... 📦"
  brew install pnpm
else
  print_success "pnpm is installed 📦"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🟢 NODE.JS CHECK                                                          │
# │ Node.js is required to run the Next.js application                        │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists node; then
  print_warning "Node.js not found. Installing via Homebrew... 🟢"
  brew install node
else
  NODE_VERSION=$(node --version)
  print_success "Node.js is installed ($NODE_VERSION) 🟢"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🦙 OLLAMA CHECK                                                           │
# │ Ollama runs local LLMs - powers our AI chore tips and prioritization      │
# └───────────────────────────────────────────────────────────────────────────┘
if ! command_exists ollama; then
  print_warning "Ollama not found. Installing via Homebrew... 🦙"
  brew install ollama
else
  print_success "Ollama is installed 🦙"
fi

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🦙 OLLAMA SERVER & MODEL SETUP                                          ║
# ║                                                                           ║
# ║   Ensure the Ollama server is running and the llama3.2 model is ready     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🦙 Setting Up AI Service"

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🚀 START OLLAMA SERVER                                                    │
# │ Check if Ollama is running, if not start it in the background             │
# └───────────────────────────────────────────────────────────────────────────┘
if ! pgrep -x "ollama" >/dev/null && ! curl -s http://localhost:11434/api/tags >/dev/null 2>&1; then
  print_info "Starting Ollama server in background... 🚀"
  ollama serve >/dev/null 2>&1 &
  OLLAMA_PID=$!
  print_success "Ollama server started (PID: $OLLAMA_PID)"

  # ⏳ Wait for server to be ready
  sleep 3
else
  print_success "Ollama server is already running 🟢"
fi

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 🧠 DOWNLOAD AI MODEL                                                      │
# │ Pull the llama3.2 model if it's not already downloaded                    │
# │ This model provides chore tips, prioritization, and workload balancing    │
# └───────────────────────────────────────────────────────────────────────────┘
if ! ollama list 2>/dev/null | grep -q "llama3.2"; then
  echo ""
  print_info "Downloading llama3.2 model... 🧠"
  print_info "This may take a few minutes on first run"
  echo ""
  ollama pull llama3.2
  print_success "llama3.2 model is ready!"
else
  print_success "llama3.2 model is available 🧠"
fi

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   📦 NPM DEPENDENCIES                                                     ║
# ║                                                                           ║
# ║   Install all Node.js packages required by the application                ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "📦 Installing Node.js Dependencies"

# 🔄 Run pnpm install to download and link all packages
pnpm install

print_success "All dependencies installed!"

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🗄️  DATABASE SETUP                                                      ║
# ║                                                                           ║
# ║   Initialize the SQLite database with our Drizzle schema                  ║
# ║   Creates tables for users and chores                                     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🗄️  Setting Up Database"

# 🔄 Push the Drizzle schema to SQLite
# Try migrate first, fall back to push for fresh installs
if pnpm db:migrate 2>/dev/null; then
  print_success "Database migrations applied!"
elif pnpm db:push 2>/dev/null; then
  print_success "Database schema pushed!"
else
  print_warning "Database will be set up on first run"
fi

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║                                                                           ║
# ║   🚀 LAUNCH APPLICATION                                                   ║
# ║                                                                           ║
# ║   Start the Next.js development server with Turbopack                     ║
# ║                                                                           ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

print_step "🚀 Launching AI Chore Manager"

echo ""
echo -e "${GREEN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   ${BOLD}🎉 All systems ready!${NC}                                   ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   📱 App:     ${CYAN}http://localhost:3000${NC}                      ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   🦙 Ollama:  ${CYAN}http://localhost:11434${NC}                     ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   ${BOLD}First time?${NC} Add family members on the login screen     ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}   Press ${BOLD}Ctrl+C${NC} to stop the server                        ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                           ${GREEN}║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# 🚀 Start the Next.js development server with Turbopack for fast HMR
pnpm dev

# ┌───────────────────────────────────────────────────────────────────────────┐
# │ 👋 END OF SCRIPT                                                          │
# │ The script will continue running until the user presses Ctrl+C            │
# │ Thank you for using AI Chore Manager! 🏠                                  │
# └───────────────────────────────────────────────────────────────────────────┘
