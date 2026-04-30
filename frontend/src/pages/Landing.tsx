import { Header } from '@/components/ui/LandingHeader';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        <section className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-foreground mb-4">Welcome to PULSE</h1>
            <p className="text-xl text-muted-foreground mb-8">Secure · Real-Time · AI-Powered Communication</p>
            <div className="space-x-4">
              <button 
                onClick={() => window.location.href = '/app'}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Launch App
              </button>
              <button 
                onClick={() => window.location.href = '/docs'}
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View Docs
              </button>
            </div>
          </div>
        </section>
        <section className="h-screen flex items-center justify-center">
          <h2 className="text-4xl font-bold">Features Section</h2>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
