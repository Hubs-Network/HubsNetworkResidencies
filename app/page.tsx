import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-5xl font-bold mb-4">Hubs Network</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          A decentralized platform connecting creative spaces (Hubs), independent workers (Pilgrims), 
          and funders (Patrons) through residency programs powered by a credit-based economy.
        </p>
      </section>

      {/* Personas Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Three Key Personas</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold mb-2">Hubs</h3>
            <p className="text-gray-600 mb-4">
              Physical spaces offering residencies, workspace, and resources. 
              Hubs receive credits each season to fund residencies and can earn more through menu items.
            </p>
            <Link href="/hubs">
              <Button variant="secondary" className="w-full">
                Explore Hubs
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="text-4xl mb-4">🚶</div>
            <h3 className="text-2xl font-bold mb-2">Pilgrims</h3>
            <p className="text-gray-600 mb-4">
              Independent workers, artists, and creators who apply for residencies. 
              Pilgrims earn credits through successful residencies and can spend them on hub services.
            </p>
            <Link href="/pilgrims">
              <Button variant="secondary" className="w-full">
                Explore Pilgrims
              </Button>
            </Link>
          </Card>

          <Card>
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold mb-2">Patrons</h3>
            <p className="text-gray-600 mb-4">
              Organizations and funders who vouch for promising applications with fiat or tokens, 
              supporting projects aligned with their values and impact goals.
            </p>
            <Link href="/patrons">
              <Button variant="secondary" className="w-full">
                Explore Patrons
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Residency Lifecycle */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Residency Lifecycle</h2>
        <Card>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-bold mb-1">Create Residency (PR)</h4>
                <p className="text-gray-600">
                  Hubs create residency opportunities, either open applications or specific project requests. 
                  They allocate credits and can tag relevant patrons.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-bold mb-1">Apply & Vouch</h4>
                <p className="text-gray-600">
                  Pilgrims submit applications. Patrons review submissions and vouch with fiat or tokens 
                  to support promising candidates.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-bold mb-1">Choose & Chat</h4>
                <p className="text-gray-600">
                  Hubs select a pilgrim and open a private chat thread to discuss terms and expectations.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="font-bold mb-1">Handshake</h4>
                <p className="text-gray-600">
                  Both parties generate a checksum of the agreement and sign a simulated transaction, 
                  formalizing the residency terms.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">5</div>
              <div>
                <h4 className="font-bold mb-1">Run & Log</h4>
                <p className="text-gray-600">
                  During the residency, both hub and pilgrim post progress updates and reflections to a shared log.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">6</div>
              <div>
                <h4 className="font-bold mb-1">Close & Evaluate</h4>
                <p className="text-gray-600">
                  Hubs close the residency with a score (0-100) and evaluation criteria. 
                  Pilgrims earn credits proportional to their score and can dispute if they disagree.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Credit System */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Credit System Lifecycle</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-xl font-bold mb-2">💰 Earning Credits</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Hubs:</strong> Receive 100 credits each season (quarterly mint)</li>
              <li>• <strong>Pilgrims:</strong> Earn credits based on residency evaluation scores</li>
              <li>• <strong>Example:</strong> Score of 85/100 = 85% of allocated credits</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-2">💸 Spending Credits</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• <strong>Hubs:</strong> Allocate credits to create new residencies</li>
              <li>• <strong>Pilgrims:</strong> Spend credits on hub menu items (workspace, tools, mentorship)</li>
              <li>• Spent credits contribute to "Next Season Live Balance"</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-2">📉 Credit Degradation</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Pilgrim credits degrade by 10% after 12 seasons of inactivity</li>
              <li>• Encourages ongoing participation in the network</li>
              <li>• Tracks "last active season" for each pilgrim</li>
            </ul>
          </Card>

          <Card>
            <h3 className="text-xl font-bold mb-2">🔄 Seasonal Cycles</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Quarterly disbursement (Q1, Q2, Q3, Q4)</li>
              <li>• Hubs receive fresh credits each season</li>
              <li>• Network tracks total economic activity</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent1 border-4 border-black rounded-lg p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
        <p className="text-lg mb-6">
          This is an interactive prototype. Switch between different roles using the session switcher 
          in the top-right corner to experience the platform from all perspectives.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/hubs">
            <Button>Browse Hubs</Button>
          </Link>
          <Link href="/pilgrims">
            <Button>Browse Pilgrims</Button>
          </Link>
          <Link href="/patrons">
            <Button>Browse Patrons</Button>
          </Link>
          <Link href="/map">
            <Button variant="outline">View Map</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
