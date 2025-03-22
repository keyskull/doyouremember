import { z } from 'zod';

export interface FunctionDefinition<T = unknown> {
  name: string;
  description: string;
  parameters: z.ZodObject<z.ZodRawShape>;
  returnType?: T;
}

export interface FunctionCall {
  name: string;
  arguments: Record<string, unknown>;
}

export interface FunctionResult<T = unknown> {
  name: string;
  result: T;
}

export type FunctionRegistry = Map<string, FunctionDefinition>;

export interface FunctionAgent {
  functions: FunctionRegistry;
  registerFunction: <T>(definition: FunctionDefinition<T>) => void;
  executeFunction: <T>(call: FunctionCall) => Promise<FunctionResult<T>>;
}

export abstract class BaseFunctionAgent implements FunctionAgent {
  functions: FunctionRegistry = new Map();

  registerFunction<T>(definition: FunctionDefinition<T>) {
    this.functions.set(definition.name, definition);
  }

  async executeFunction<T>(call: FunctionCall): Promise<FunctionResult<T>> {
    const definition = this.functions.get(call.name);
    if (!definition) {
      throw new Error(`Function ${call.name} not found`);
    }

    try {
      // Validate arguments against the schema
      const validatedArgs = definition.parameters.parse(call.arguments);
      
      // Execute the function (to be implemented by derived classes)
      const result = await this.executeFunctionImpl<T>(call.name, validatedArgs);
      
      return {
        name: call.name,
        result
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new Error(`Invalid arguments for function ${call.name}: ${error.message}`);
      }
      throw error;
    }
  }

  protected abstract executeFunctionImpl<T>(name: string, args: Record<string, unknown>): Promise<T>;
}

// Example function definition with Zod schema
export const weatherFunctionExample: FunctionDefinition<{ temperature: number; condition: string }> = {
  name: 'get_weather',
  description: 'Get the current weather for a location',
  parameters: z.object({
    location: z.string().min(1),
    units: z.enum(['celsius', 'fahrenheit']).optional().default('celsius'),
  }),
}; 