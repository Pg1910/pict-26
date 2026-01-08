// This file is minimal because the application uses an external backend for business logic.
// We keep it to satisfy the project structure and potentially handle local user preferences if needed in the future.

export interface IStorage {
  // Add any local storage methods here if needed
}

export class MemStorage implements IStorage {
  constructor() {}
}

export const storage = new MemStorage();
