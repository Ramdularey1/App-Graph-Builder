function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
          App Graph Builder
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight sm:text-6xl">
          Vite and Tailwind are ready for your frontend.
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Start building graph nodes, relationships, dashboards, or any app
          workflow from this configured React starter.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <span className="rounded-md border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm text-cyan-100">
            Vite
          </span>
          <span className="rounded-md border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-sm text-emerald-100">
            Tailwind CSS
          </span>
          <span className="rounded-md border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-2 text-sm text-fuchsia-100">
            React
          </span>
        </div>
      </section>
    </main>
  );
}

export default App;
