import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { openai } from "@ai-sdk/openai";

export const myProvider = customProvider({
  languageModels: {
    "chat-model": openai("gpt-5"),
    "chat-model-reasoning": wrapLanguageModel({
      model: openai("o3"),
      middleware: extractReasoningMiddleware({ tagName: "think" }),
    }),
    "title-model": openai("gpt-5-mini"),
    "artifact-model": openai("gpt-5-mini"),
  },
  imageModels: {
    "small-model": openai.imageModel("gpt-image-1"),
  },
});
