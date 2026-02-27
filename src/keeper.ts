import { ethers } from "ethers";
import { config } from "./config";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class Keeper {
  private provider: ethers.JsonRpcProvider;
  private wallet: ethers.Wallet;
  private running: boolean = false;

  constructor() {
    this.provider = new ethers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
  }

  public async start(): Promise<void> {
    if (this.running) return;

    this.running = true;

    console.log("Keeper started...");
    console.log("Connected wallet:", this.wallet.address);

    await this.runLoop();
  }

  public stop(): void {
    console.log("Stopping keeper...");
    this.running = false;
  }

  private async runLoop(): Promise<void> {
    while (this.running) {
      try {
        await this.check();
      } catch (error) {
        console.error("Error during keeper execution:", error);
      }

      await sleep(config.pollInterval);
    }

    console.log("Keeper stopped.");
  }

  private async check(): Promise<void> {
    const timeoutMs = 30000; // 30 seconds
  const blockNumber = await Promise.race([
    this.provider.getBlockNumber(),
    new Promise<never>((_, reject) => 
      setTimeout(() => reject(new Error("RPC call timed out")), timeoutMs)
    )
  ]);
    console.log(`Current block: ${blockNumber}`);

    // Future:
    // - Check protocol conditions
    // - Execute transactions if needed
  }
}
