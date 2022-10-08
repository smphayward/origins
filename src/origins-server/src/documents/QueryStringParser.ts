import express, { Router } from "express";

export class QueryStringParser {
  constructor() {}

  public parseGetMany(req: express.Request) {
    return {
      maxResults: this.getPositiveInt(req, "max") ?? 25, // TODO: make this configurable
      continuationToken: (req.query.continue as string) ?? null,
    };
  }

  public parseSearch(req: express.Request) {
    return {
      maxResults: this.getPositiveInt(req, "max") ?? 25, // TODO: make this configurable
      continuationToken: (req.query.continue as string) ?? null,
      query: (req.query.q as string) ?? null,
      
    };
  }

  // HELPERS

  // Probably should do a bad reqest if it's specified but invalid
  // Probably should move this elsewhere
  private getPositiveInt = (
    req: express.Request,
    name: string
  ): number | undefined => {
    const valueRaw = req.query[name];

    if (!valueRaw) return undefined;

    const s = req.query.max as string;
    if (!s) {
      return undefined;
    }
    let n = Number(s);
    if (isNaN(n)) {
      return undefined;
    }
    n = Math.trunc(n);
    if (n < 1) {
      return undefined;
    }
    return n;
  };
}