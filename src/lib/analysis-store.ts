export type AnalyseActivityRequest = {
  date_range: {
    start: string;
    end: string;
  };
  activities: string[];
  origin: {
    name: string;
    lat: number;
    lon: number;
  };
  destination: {
    name: string;
    lat: number;
    lon: number;
  };
};

export type AnalyseActivityResponse = unknown;

let lastAnalyseRequest: AnalyseActivityRequest | null = null;
let lastAnalyseResponse: AnalyseActivityResponse | null = null;

// AI chat state (stateless backend, so we keep ephemeral state here)
let aiChatHistory = ""; // serialized as plain text lines
let aiChatCount = 0; // number of user messages sent
let aiInitialSent = false; // whether first summary (without user_message) was sent

export function setLastAnalyseRequest(payload: AnalyseActivityRequest) {
  lastAnalyseRequest = payload;
}

export function getLastAnalyseRequest() {
  return lastAnalyseRequest;
}

export function setLastAnalyseResponse(response: AnalyseActivityResponse) {
  lastAnalyseResponse = response;
  // Optional: reset chat state when new analysis is loaded
  aiChatHistory = "";
  aiChatCount = 0;
  aiInitialSent = false;
}

export function getLastAnalyseResponse() {
  return lastAnalyseResponse;
}

// AI chat helpers
export function getAiChatHistory() {
  return aiChatHistory;
}

export function setAiChatHistory(history: string) {
  aiChatHistory = history;
}

export function appendAiChatHistory(line: string) {
  aiChatHistory = aiChatHistory ? `${aiChatHistory}\n${line}` : line;
}

export function getAiChatCount() {
  return aiChatCount;
}

export function incrementAiChatCount() {
  aiChatCount += 1;
}

export function getAiInitialSent() {
  return aiInitialSent;
}

export function setAiInitialSent(sent: boolean) {
  aiInitialSent = sent;
}

export function resetAiChat() {
  aiChatHistory = "";
  aiChatCount = 0;
  aiInitialSent = false;
}
