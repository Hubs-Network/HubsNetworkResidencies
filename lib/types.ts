// Core Types for Hubs Network

export type ResidencyStatus = "SUBMISSIONS_OPEN" | "RUNNING" | "CLOSED";
export type ResidencyType = "OPEN_APPLICATION" | "SPECIFIC_PR";
export type DisputeStatus = "PENDING" | "RESOLVED";
export type MessageFromType = "HUB" | "PILGRIM" | "PATRON";
export type VouchByType = "HUB" | "PATRON";

export interface MenuItem {
  code: string;
  title: string;
  description: string;
  priceCredits: number;
}

export interface Hub {
  id: string;
  name: string;
  description: string;
  address: string;
  links: string[];
  contact: string;
  impactTags: string[];
  esgImpactText: string;
  kpiTags: string[]; // GIIN taxonomy references
  menuItems: MenuItem[];
  creditBalance: number;
  residencies: Residency[];
  // For map
  lat?: number;
  lng?: number;
}

export interface Pilgrim {
  id: string;
  ethereumAddress: string; // Ethereum address as unique identifier
  name: string;
  alias?: string;
  ens?: string;
  tags: string[];
  skills: string[];
  referrals: string[];
  referralCodeUsed: string;
  creditBalance: number;
  reputationScore: number;
  residencies: {
    residencyId: string;
    role: string;
    status: ResidencyStatus;
  }[];
  lastActiveSeason?: number; // For degradation tracking
}

export interface Patron {
  id: string;
  name: string;
  description: string;
  links: string[];
  contact: string;
  standardsTags: string[]; // ESG, B-corp, Open source
}

export interface ChatMessage {
  id: string;
  fromType: MessageFromType;
  fromId: string;
  text: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  messages: ChatMessage[];
}

export interface VouchToken {
  contract: string;
  amount: number;
}

export interface Vouch {
  id: string;
  byType: VouchByType;
  byId: string;
  amountFiat?: number;
  token?: VouchToken;
  committed: boolean;
  txHash?: string;
  requirementsText?: string; // Patron's requirements for the vouch
}

export interface Submission {
  id: string;
  residencyId: string;
  pilgrimId: string;
  text: string;
  proposedTitle?: string;
  proposedDescription?: string;
  createdAt: string;
  vouches: Vouch[];
}

export interface Handshake {
  checksum: string;
  agreementJson: string;
  signedByHub: boolean;
  signedByPilgrim: boolean;
  signedAt?: string;
}

export interface EvaluationField {
  key: string;
  type: "boolean" | "scale1to5";
  value: boolean | number;
}

export interface ResidencyClosing {
  score0to100: number;
  evaluationFields: EvaluationField[];
  closedAt: string;
}

export interface Dispute {
  status: DisputeStatus;
  motivation: string;
  agreementToDisagreementFactor: number;
}

export interface LogPost {
  id: string;
  authorType: MessageFromType;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Residency {
  id: string;
  hubId: string;
  type: ResidencyType;
  title: string;
  description: string;
  giinTags: string[];
  complianceFactors: string[];
  status: ResidencyStatus;
  creditAllocated: number;
  taggedPatronIds: string[];
  submissions: Submission[];
  chosenPilgrimId?: string;
  thread: ChatThread;
  handshake?: Handshake;
  logPosts: LogPost[];
  closing?: ResidencyClosing;
  dispute?: Dispute;
}

export interface Season {
  id: string;
  quarterLabel: string; // e.g., "Q1 2026"
  disbursementDate: string;
  hubMintAmount: number;
  nextSeasonLiveBalance: number;
}

export interface MockDatabase {
  hubs: Hub[];
  pilgrims: Pilgrim[];
  patrons: Patron[];
  seasons: Season[];
  currentSeason: number; // index
}

// Session types
export type SessionType = "GUEST" | "HUB" | "PILGRIM" | "PATRON";

export interface Session {
  type: SessionType;
  id?: string; // entity id when logged in
}
