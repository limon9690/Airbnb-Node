import { createProxyMiddleware } from "http-proxy-middleware";
import type { Request, Response } from "express";
import type { Socket } from "net";

const handleProxyError = (err: Error, req: Request, res: Response | Socket) => {
  if ("status" in res) {
    res.status(502).json({
      success: false,
      message: "Bad Gateway: Microservice unreachable",
    });
    return;
  }

  res.destroy();
};

export const proxyMiddleware = (targetURL: string) => {
  return createProxyMiddleware({
    target: targetURL,
    changeOrigin: true,
    // pathRewrite: {
    //   [`^${path}`]: "",
    // },
    on: {
      error: handleProxyError,
    },
  });
};
