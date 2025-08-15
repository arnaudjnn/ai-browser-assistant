import { experimental_createMCPClient as createMCPClient } from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import mcpConfig from "@/mcp.json";

interface MCPServer {
  url: string;
  headers?: Record<string, string>;
}

interface MCPConfig {
  mcpServers: Record<string, MCPServer>;
}

export async function getMcpTools() {
  const config = mcpConfig as MCPConfig;
  const mcpServers = Object.values(config.mcpServers);

  const tools = await Promise.all(
    mcpServers.map(async (server) => {
      let validUrl: URL;
      try {
        validUrl = new URL(server.url);
      } catch (error) {
        console.log("error", error);
        return [];
      }
      try {
        const mcpClient = await createMCPClient({
          transport: new StreamableHTTPClientTransport(new URL(server.url), {
            requestInit: {
              headers: server.headers || {},
            },
          }),
        });
        const tools = await mcpClient.tools();
        return Object.entries(tools).map(([defaultKey, value]) => {
          return {
            [defaultKey.toUpperCase()]: value,
          };
        });
      } catch (error) {
        console.log("error", error);
        return [];
      }
    })
  );
  return Object.assign({}, ...tools.flat().filter(Boolean));
}
