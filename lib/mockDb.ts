import { MockDatabase, Hub, Pilgrim, Patron, Residency, Season, Submission, ChatMessage, LogPost, Vouch } from "./types";
import { seedData } from "./seed";

const STORAGE_KEY = "hubs-network-db";
const PERSISTENCE_ENABLED_KEY = "hubs-network-persistence-enabled";

// In-memory database
let db: MockDatabase = JSON.parse(JSON.stringify(seedData));

// Check if persistence is enabled
export function isPersistenceEnabled(): boolean {
  if (typeof window === "undefined") return false;
  const enabled = localStorage.getItem(PERSISTENCE_ENABLED_KEY);
  return enabled === null || enabled === "true"; // default to true
}

export function setPersistenceEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERSISTENCE_ENABLED_KEY, String(enabled));
  if (enabled) {
    saveToStorage();
  }
}

// Load from localStorage
export function loadFromStorage(): MockDatabase {
  if (typeof window === "undefined" || !isPersistenceEnabled()) {
    return { ...seedData };
  }
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      db = parsed;
      return parsed;
    }
  } catch (error) {
    console.error("Failed to load from storage:", error);
  }
  
  return { ...seedData };
}

// Save to localStorage
export function saveToStorage(): void {
  if (typeof window === "undefined" || !isPersistenceEnabled()) return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch (error) {
    console.error("Failed to save to storage:", error);
  }
}

// Reset to seed data
export function resetToSeed(): void {
  db = JSON.parse(JSON.stringify(seedData)); // deep clone
  saveToStorage();
}

// Initialize DB
export function initDb(): MockDatabase {
  db = loadFromStorage();
  return db;
}

// Get entire DB
export function getDb(): MockDatabase {
  return db;
}

// ============ HUBS ============

export function getAllHubs(): Hub[] {
  return db.hubs;
}

export function getHubById(id: string): Hub | undefined {
  return db.hubs.find((h) => h.id === id);
}

export function createHub(hub: Hub): Hub {
  db.hubs.push(hub);
  saveToStorage();
  return hub;
}

export function updateHub(id: string, updates: Partial<Hub>): Hub | undefined {
  const index = db.hubs.findIndex((h) => h.id === id);
  if (index === -1) return undefined;
  
  db.hubs[index] = { ...db.hubs[index], ...updates };
  saveToStorage();
  return db.hubs[index];
}

export function deleteHub(id: string): boolean {
  const index = db.hubs.findIndex((h) => h.id === id);
  if (index === -1) return false;
  
  db.hubs.splice(index, 1);
  saveToStorage();
  return true;
}

// ============ PILGRIMS ============

export function getAllPilgrims(): Pilgrim[] {
  return db.pilgrims;
}

export function getPilgrimById(id: string): Pilgrim | undefined {
  return db.pilgrims.find((p) => p.id === id);
}

export function createPilgrim(pilgrim: Pilgrim): Pilgrim {
  db.pilgrims.push(pilgrim);
  saveToStorage();
  return pilgrim;
}

export function updatePilgrim(id: string, updates: Partial<Pilgrim>): Pilgrim | undefined {
  const index = db.pilgrims.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  
  db.pilgrims[index] = { ...db.pilgrims[index], ...updates };
  saveToStorage();
  return db.pilgrims[index];
}

export function deletePilgrim(id: string): boolean {
  const index = db.pilgrims.findIndex((p) => p.id === id);
  if (index === -1) return false;
  
  db.pilgrims.splice(index, 1);
  saveToStorage();
  return true;
}

// ============ PATRONS ============

export function getAllPatrons(): Patron[] {
  return db.patrons;
}

export function getPatronById(id: string): Patron | undefined {
  return db.patrons.find((p) => p.id === id);
}

export function createPatron(patron: Patron): Patron {
  db.patrons.push(patron);
  saveToStorage();
  return patron;
}

export function updatePatron(id: string, updates: Partial<Patron>): Patron | undefined {
  const index = db.patrons.findIndex((p) => p.id === id);
  if (index === -1) return undefined;
  
  db.patrons[index] = { ...db.patrons[index], ...updates };
  saveToStorage();
  return db.patrons[index];
}

export function deletePatron(id: string): boolean {
  const index = db.patrons.findIndex((p) => p.id === id);
  if (index === -1) return false;
  
  db.patrons.splice(index, 1);
  saveToStorage();
  return true;
}

// ============ RESIDENCIES ============

export function getAllResidencies(): Residency[] {
  return db.hubs.flatMap((h) => h.residencies);
}

export function getResidencyById(id: string): Residency | undefined {
  for (const hub of db.hubs) {
    const residency = hub.residencies.find((r) => r.id === id);
    if (residency) return residency;
  }
  return undefined;
}

export function createResidency(hubId: string, residency: Residency): Residency | undefined {
  const hub = getHubById(hubId);
  if (!hub) return undefined;
  
  hub.residencies.push(residency);
  saveToStorage();
  return residency;
}

export function updateResidency(id: string, updates: Partial<Residency>): Residency | undefined {
  for (const hub of db.hubs) {
    const index = hub.residencies.findIndex((r) => r.id === id);
    if (index !== -1) {
      hub.residencies[index] = { ...hub.residencies[index], ...updates };
      saveToStorage();
      return hub.residencies[index];
    }
  }
  return undefined;
}

export function deleteResidency(id: string): boolean {
  for (const hub of db.hubs) {
    const index = hub.residencies.findIndex((r) => r.id === id);
    if (index !== -1) {
      hub.residencies.splice(index, 1);
      saveToStorage();
      return true;
    }
  }
  return false;
}

// ============ SUBMISSIONS ============

export function addSubmission(residencyId: string, submission: Submission): Submission | undefined {
  const residency = getResidencyById(residencyId);
  if (!residency) return undefined;
  
  residency.submissions.push(submission);
  saveToStorage();
  return submission;
}

export function getSubmissionById(residencyId: string, submissionId: string): Submission | undefined {
  const residency = getResidencyById(residencyId);
  if (!residency) return undefined;
  
  return residency.submissions.find((s) => s.id === submissionId);
}

// ============ VOUCHES ============

export function addVouch(residencyId: string, submissionId: string, vouch: Vouch): Vouch | undefined {
  const submission = getSubmissionById(residencyId, submissionId);
  if (!submission) return undefined;
  
  submission.vouches.push(vouch);
  saveToStorage();
  return vouch;
}

// ============ CHAT ============

export function addChatMessage(residencyId: string, message: ChatMessage): ChatMessage | undefined {
  const residency = getResidencyById(residencyId);
  if (!residency) return undefined;
  
  residency.thread.messages.push(message);
  saveToStorage();
  return message;
}

// ============ LOG POSTS ============

export function addLogPost(residencyId: string, logPost: LogPost): LogPost | undefined {
  const residency = getResidencyById(residencyId);
  if (!residency) return undefined;
  
  residency.logPosts.push(logPost);
  saveToStorage();
  return logPost;
}

// ============ SEASONS ============

export function getCurrentSeason(): Season {
  return db.seasons[db.currentSeason];
}

export function advanceSeason(): Season {
  const currentSeason = getCurrentSeason();
  
  // Create next season
  const nextSeasonNum = db.currentSeason + 1;
  const nextQuarter = getNextQuarter(currentSeason.quarterLabel);
  const nextDisbursement = getNextDisbursementDate(currentSeason.disbursementDate);
  
  const newSeason: Season = {
    id: `season-${nextSeasonNum + 1}`,
    quarterLabel: nextQuarter,
    disbursementDate: nextDisbursement,
    hubMintAmount: 100,
    nextSeasonLiveBalance: 0,
  };
  
  db.seasons.push(newSeason);
  db.currentSeason = nextSeasonNum;
  
  // Apply degradation to pilgrims inactive for 12+ seasons
  db.pilgrims.forEach((pilgrim) => {
    const lastActive = pilgrim.lastActiveSeason ?? 0;
    const seasonsSinceActive = db.currentSeason - lastActive;
    
    if (seasonsSinceActive >= 12 && pilgrim.creditBalance > 0) {
      // Degrade credits by 10%
      pilgrim.creditBalance = Math.floor(pilgrim.creditBalance * 0.9);
    }
  });
  
  saveToStorage();
  return newSeason;
}

function getNextQuarter(currentQuarter: string): string {
  const match = currentQuarter.match(/Q(\d) (\d{4})/);
  if (!match) return "Q1 2026";
  
  let q = parseInt(match[1]);
  let year = parseInt(match[2]);
  
  q++;
  if (q > 4) {
    q = 1;
    year++;
  }
  
  return `Q${q} ${year}`;
}

function getNextDisbursementDate(currentDate: string): string {
  const date = new Date(currentDate);
  date.setMonth(date.getMonth() + 3);
  return date.toISOString().split("T")[0];
}

// ============ CREDITS ============

export function transferCredits(fromType: "HUB" | "PILGRIM", fromId: string, amount: number, toNextSeason: boolean = false): boolean {
  if (fromType === "HUB") {
    const hub = getHubById(fromId);
    if (!hub || hub.creditBalance < amount) return false;
    hub.creditBalance -= amount;
  } else {
    const pilgrim = getPilgrimById(fromId);
    if (!pilgrim || pilgrim.creditBalance < amount) return false;
    pilgrim.creditBalance -= amount;
    pilgrim.lastActiveSeason = db.currentSeason;
  }
  
  if (toNextSeason) {
    const season = getCurrentSeason();
    season.nextSeasonLiveBalance += amount;
  }
  
  saveToStorage();
  return true;
}

export function addCredits(toType: "HUB" | "PILGRIM", toId: string, amount: number): boolean {
  if (toType === "HUB") {
    const hub = getHubById(toId);
    if (!hub) return false;
    hub.creditBalance += amount;
  } else {
    const pilgrim = getPilgrimById(toId);
    if (!pilgrim) return false;
    pilgrim.creditBalance += amount;
    pilgrim.lastActiveSeason = db.currentSeason;
  }
  
  saveToStorage();
  return true;
}

// ============ UTILITIES ============

export function generateTxHash(): string {
  return "0x" + Array.from({ length: 64 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
}

export async function generateChecksum(data: any): Promise<string> {
  const jsonString = JSON.stringify(data);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  const hashBuffer = await crypto.subtle.digest("SHA-256", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  return `sha256:${hashHex}`;
}
