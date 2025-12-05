# x-tools: Team Identity Wizard

**x-tools** is a powerful, interactive wizard designed to help teams define, visualize, and align their core identity. From Mission and Vision to detailed Behaviors and Goals, x-tools guides you through a structured process, leveraging AI to generate insights and a dynamic graph to visualize connections.

## 🚀 Key Features

-   **Structured Wizard Workflow**: A 10-step guided process to define your team's Circle, Purpose, Vision, Mission, Strategy, Values, Principles, Behaviors, Goals, and Roles.
-   **AI-Powered Insights**: Integrated AI (Groq/Llama 3) to generate suggestions for keywords, descriptions, and semantic tags.
-   **Dynamic Ontology Graph**: An interactive, force-directed graph (React Flow) that visualizes the relationships between your team's identity elements (e.g., how a Goal implements a Strategy, or how a Behavior derives from a Value).
-   **Graph Editing**: Directly manipulate the graph structure—add connections, edit nodes, and see changes reflected in your team model.
-   **Supabase Persistence**: Securely save and load team configurations using Supabase (or fallback to LocalStorage).
-   **Export & Sharing**: Export your Team Canvas as a JSON file or visualize it for presentations.
-   **Deterministic Design**: A "Deterministic" UI mode that adheres to strict design principles for clean, predictable aesthetics.

## 🛠 Tech Stack

-   **Frontend**: [React 18](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **State Management**: Custom React Context + Reducers with History (Undo/Redo)
-   **Visualization**: [React Flow](https://reactflow.dev/) (Interactive Graph)
-   **AI**: [Groq SDK](https://console.groq.com/) (LLM Integration)
-   **Storage**: [Supabase](https://supabase.com/) (PostgreSQL + JSONB)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Installation

Prerequisites: Node.js v18+

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/x-talks/x-tools.git
    cd x-tools
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Setup**:
    Create a `.env` file in the root directory (copy from `.env.example` if available) and add your API keys:

    ```env
    VITE_GROQ_API_KEY=your_groq_api_key_here
    VITE_SUPABASE_URL=your_supabase_url_here
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
    ```

    *Note: If Supabase keys are missing, the app will fallback to LocalStorage.*

4.  **Run Locally**:
    ```bash
    npm run dev
    ```

5.  **Build for Production**:
    ```bash
    npm run build
    ```

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── graph/           # Graph visualization components (InteractiveGraph, etc.)
│   ├── ui/              # Reusable UI components (Buttons, Cards, Modals)
│   ├── wizard/          # Step-by-step wizard screens (Step1_Purpose, etc.)
│   └── ...
├── core/                # Core logic and types
│   ├── ai.ts            # AI service integration
│   ├── ontology.ts      # Graph ontology builder
│   ├── store.tsx        # Global state management
│   ├── types.ts         # TypeScript interfaces
│   └── validation.ts    # Zod schemas
├── test/                # Unit and Integration tests
└── App.tsx              # Main entry point
```

## 🧪 Running Tests

We use [Vitest](https://vitest.dev/) for testing.

```bash
# Run all tests
npm test

# Run specific test file
npx vitest run src/test/metadata_persistence.test.ts
```

## 🤝 Contribution

1.  Fork the repo
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
