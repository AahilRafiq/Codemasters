import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Code2, Trophy, Building2, Brain, Rocket, ArrowRight } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-background dark:text-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center space-x-3">
            <Code2 className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold">Codemasters</h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
            Master coding challenges, compete in contests, and get noticed by top companies
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg">
              Start Coding <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Host a Contest
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 space-y-4">
              <Trophy className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Competitive Coding</h3>
              <p className="text-muted-foreground">
                Participate in coding contests and climb the global leaderboard
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <Building2 className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Company Contests</h3>
              <p className="text-muted-foreground">
                Get discovered by top companies through exclusive hiring contests
              </p>
            </Card>
            <Card className="p-6 space-y-4">
              <Brain className="h-10 w-10 text-primary" />
              <h3 className="text-xl font-semibold">Practice Problems</h3>
              <p className="text-muted-foreground">
                Sharpen your skills with our curated collection of coding problems
              </p>
            </Card>
          </div>
        </div>
      </section>

      
      {/* Why Choose Us Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Codemasters?</h2>
            <p className="text-muted-foreground">The platform that helps you grow as a developer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                icon: <Brain className="h-6 w-6" />,
                title: "Diverse Problem Set",
                description: "From easy to advanced, covering all major DSA concepts",
              },
              {
                icon: <Trophy className="h-6 w-6" />,
                title: "Real-time Rankings",
                description: "Compare your performance with developers worldwide",
              },
              {
                icon: <Building2 className="h-6 w-6" />,
                title: "Company Recognition",
                description: "Get noticed by top tech companies through contests",
              },
              {
                icon: <Rocket className="h-6 w-6" />,
                title: "Career Growth",
                description: "Improve your skills and advance your career",
              },
            ].map((feature, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 container mx-auto px-4">
        <Card className="p-8 text-center max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Journey?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of developers who are already mastering their coding skills
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg">
              Start Coding Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Practice Problems
            </Button>
          </div>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code2 className="h-6 w-6" />
            <span className="font-semibold">Codemasters</span>
          </div>
          <p>© 2024 Codemasters. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;