export interface MessageResponse {
  choices: Array<{
    finish_reason: string;
    index: number;
    message: {
      content: string;
      role: string;
    }
    created: number;
    id: string;
    model: string;
    object: string;
    usage: {
      completion_tokens: number;
      prompt_tokens: number;
      total_tokens: number;
    }
  }>;
}